import { defineStore } from "pinia"
import { toRaw } from "vue"
import type { User } from "firebase/auth"

import { deleteLocalProject, getAllLocalProjects, putLocalProject } from "../local/db.js"
import {
  fetchProjectFiles,
  fetchProjects,
  generateId,
  migrateLegacyProject,
  pushProject,
  pushProjectFile,
  pushProjectName,
  removeProject,
  type RemoteProjectRow,
} from "../remote/db.js"
import { consumeRedirect, signIn as remoteSignIn, signOut as remoteSignOut, watchUser } from "../remote/auth.js"
import { fileTypes, type Project, type ProjectData } from "../types/project.js"

const defaultData: ProjectData = {
  css: "html {\n  background-color: #111;\n  color: #fff;\n}\n",
  html: "<p> Hello, world! </p>\n",
  javascript: "const p = document.querySelector('p');\n",
  name: "Untitled",
}

function logError(e: unknown): void {
  console.log(e instanceof Error ? e.message : e)
}

function fallbackContent(existing?: Project): Pick<ProjectData, "css" | "html" | "javascript"> {
  return {
    css: existing?.css ?? "",
    html: existing?.html ?? "",
    javascript: existing?.javascript ?? "",
  }
}

function hasContent(project?: Project): boolean {
  return Boolean(project?.css || project?.html || project?.javascript)
}

async function pushUpdate(uid: string, key: string, name: keyof ProjectData, value: string): Promise<void> {
  try {
    if (name === "name") {
      await pushProjectName(uid, key, value)
    } else {
      await pushProjectFile(uid, key, name, value)
    }
  } catch (e) {
    logError(e)
  }
}

export interface State {
   authPromise?: Promise<User | null>;
   loading: boolean;
   loadPromise?: Promise<void>;
   projects: Record<string, Project>;
   signInError?: string;
   user?: User;
}

export const useProjectStore = defineStore("projects", {
  state: (): State => ({
    loading: true,
    projects: {},
  }),
  actions: {
    async init() {
      await this.hydrateLocal()
      this.loading = false
      let resolveAuth: (user: User | null) => void
      this.authPromise = new Promise((resolve) => {
        resolveAuth = resolve
      })
      watchUser((user: User | null) => {
        resolveAuth(user)
        if (user) {
          this.user = user
          this.loadPromise = this.loadProjects()
        } else {
          delete this.user
          delete this.loadPromise
        }
      })
      try {
        await consumeRedirect()
      } catch (e) {
        this.signInError = e instanceof Error ? e.message : String(e)
        logError(e)
      }
    },
    async hydrateLocal() {
      for (const project of await getAllLocalProjects()) {
        this.projects[project.key] = project
      }
    },
    mergeRemoteRow(row: RemoteProjectRow): Project {
      const existing = this.projects[row.key]
      const content = row.embeddedContent ?? fallbackContent(existing)
      // Fix a bug which caused projects to be synced with empty content
      const contentLoaded = Boolean(row.embeddedContent) ||
        (Boolean(existing?.contentLoaded) && hasContent(existing))
      return {
        key: row.key,
        name: row.name,
        created: row.created,
        updated: row.updated,
        syncedAt: Date.now(),
        contentLoaded,
        ...content,
      }
    },
    async loadProjects() {
      if (!this.user) return
      const uid = this.user.uid
      try {
        const rows = await fetchProjects(uid)
        const legacyRows: RemoteProjectRow[] = []
        for (const row of rows) {
          this.projects[row.key] = this.mergeRemoteRow(row)
          if (row.embeddedContent) legacyRows.push(row)
        }
        for (const row of rows) {
          await putLocalProject(toRaw(this.projects[row.key]))
        }
        for (const row of legacyRows) {
          await migrateLegacyProject(uid, row.key, toRaw(this.projects[row.key])).catch(logError)
        }
      } catch (e) {
        logError(e)
      }
    },
    async addProject(data: ProjectData = defaultData) {
      const project: Project = {
        name: data.name,
        css: data.css,
        html: data.html,
        javascript: data.javascript,
        created: Date.now(),
        updated: Date.now(),
        key: generateId(),
        contentLoaded: true,
      }
      try {
        await putLocalProject(project)
        this.projects[project.key] = project
        return project.key
      } catch (e) {
        logError(e)
      }
    },
    async loadProjectContent(key: string): Promise<boolean> {
      const project = this.projects[key]
      if (!project || project.contentLoaded) return true
      if (!project.syncedAt) {
        this.projects[key].contentLoaded = true
        await putLocalProject(toRaw(this.projects[key]))
        return true
      }
      await this.authPromise
      if (!this.user) return false
      try {
        const { files, fromCache } = await fetchProjectFiles(this.user.uid, key)
        const complete = fileTypes.every((type) => type in files)
        if (fromCache && !complete) return false
        Object.assign(this.projects[key], files)
        this.projects[key].contentLoaded = true
        await putLocalProject(toRaw(this.projects[key]))
        return true
      } catch (e) {
        logError(e)
        return false
      }
    },
    async saveToAccount(key: string) {
      if (!this.user) {
        this.signIn()
        return
      }
      await this.loadPromise
      const project = this.projects[key]
      if (!project) return
      try {
        await pushProject(this.user.uid, key, project, { isNew: !project.syncedAt })
        this.projects[key].syncedAt = Date.now()
        this.projects[key].contentLoaded = true
        await putLocalProject(toRaw(this.projects[key]))
      } catch (e) {
        logError(e)
      }
    },
    async deleteProject({ key }: { key: string }) {
      try {
        const synced = this.projects[key]?.syncedAt
        delete this.projects[key]
        await deleteLocalProject(key)
        if (this.user && synced) {
          removeProject(this.user.uid, key).catch(logError)
        }
      } catch (e) {
        logError(e)
      }
    },
    async updateProject({ key, name, value }: { key: string; name: keyof ProjectData; value: string }) {
      try {
        this.projects[key][name] = value
        this.projects[key].updated = Date.now()
        await putLocalProject(toRaw(this.projects[key]))
        const synced = this.projects[key].syncedAt
        // Attempt not to push bad (empty) content over good
        if (this.user && synced && this.projects[key].contentLoaded) {
          void pushUpdate(this.user.uid, key, name, value)
        }
      } catch (e) {
        logError(e)
      }
    },
    async signIn() {
      try {
        await remoteSignIn()
      } catch (e) {
        this.signInError = e instanceof Error ? e.message : String(e)
        logError(e)
      }
    },
    signOut() {
      remoteSignOut()
    },
  },
})
