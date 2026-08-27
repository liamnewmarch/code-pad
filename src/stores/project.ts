import { defineStore } from "pinia"
import { toRaw } from "vue"
import type { User } from "firebase/auth"
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth"
import { collection, doc, getDocs, Timestamp, updateDoc, writeBatch } from "firebase/firestore"

import { auth, db } from "../firebase.js"
import { deleteLocalProject, getAllLocalProjects, putLocalProject } from "../local/db.js"
import type { Project, ProjectData } from "../types/project.js"

const defaultData: ProjectData = {
  css: "html {\n  background-color: #111;\n  color: #fff;\n}\n",
  html: "<p> Hello, world! </p>\n",
  javascript: "const p = document.querySelector('p');\n",
  name: "Untitled",
}

type FileType = "css" | "html" | "javascript"

const projectsRef = (uid: string) => collection(db, "users", uid, "projects")
const projectRef = (uid: string, key: string) => doc(db, "users", uid, "projects", key)
const filesRef = (uid: string, key: string) => collection(db, "users", uid, "projects", key, "files")
const fileRef = (uid: string, key: string, type: FileType) => doc(db, "users", uid, "projects", key, "files", type)
const generateId = () => doc(collection(db, "_ids")).id

function toStr(v: unknown): string {
  return typeof v === "string" ? v : ""
}

function toMillis(v: unknown): number {
  return v instanceof Timestamp ? v.toMillis() : Date.now()
}

async function migrateLegacyProject(uid: string, key: string, project: Project) {
  const batch = writeBatch(db)
  batch.set(projectRef(uid, key), {
    name: project.name,
    created: Timestamp.fromMillis(project.created),
    updated: Timestamp.fromMillis(project.updated),
  })
  batch.set(fileRef(uid, key, "css"), { value: project.css })
  batch.set(fileRef(uid, key, "html"), { value: project.html })
  batch.set(fileRef(uid, key, "javascript"), { value: project.javascript })
  await batch.commit()
}

export interface State {
   loading: boolean;
   loadPromise?: Promise<void>;
   projects: Record<string, Project>;
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
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
          this.loadPromise = this.loadProjects()
        } else {
          delete this.user
          delete this.loadPromise
        }
      })
    },
    async hydrateLocal() {
      for (const project of await getAllLocalProjects()) {
        this.projects[project.key] = project
      }
    },
    async loadProjects() {
      if (!this.user) return
      try {
        const result = await getDocs(projectsRef(this.user.uid))
        const projects: Record<string, Project> = {}
        for (const snapshot of result.docs) {
          const d = snapshot.data()
          const existing = this.projects[snapshot.id]
          const hasEmbeddedContent = typeof d["css"] === "string"
          const project: Project = {
            key: snapshot.id,
            name: toStr(d["name"]),
            css: hasEmbeddedContent ? toStr(d["css"]) : (existing?.css ?? ""),
            html: hasEmbeddedContent ? toStr(d["html"]) : (existing?.html ?? ""),
            javascript: hasEmbeddedContent ? toStr(d["javascript"]) : (existing?.javascript ?? ""),
            created: toMillis(d["created"]),
            updated: toMillis(d["updated"]),
            syncedAt: Date.now(),
            contentLoaded: hasEmbeddedContent || (existing?.contentLoaded ?? false),
          }
          projects[snapshot.id] = project
          await putLocalProject(project)
          if (hasEmbeddedContent) {
            try {
              await migrateLegacyProject(this.user.uid, snapshot.id, project)
            } catch (e) {
              console.log(e instanceof Error ? e.message : e)
            }
          }
        }
        Object.assign(this.projects, projects)
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
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
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async loadProjectContent(key: string) {
      const project = this.projects[key]
      if (!project || project.contentLoaded) return
      if (!this.user || !project.syncedAt) {
        this.projects[key].contentLoaded = true
        await putLocalProject(toRaw(this.projects[key]))
        return
      }
      try {
        const result = await getDocs(filesRef(this.user.uid, key))
        for (const snapshot of result.docs) {
          const type = snapshot.id
          if (type === "css" || type === "html" || type === "javascript") {
            this.projects[key][type] = toStr(snapshot.data()["value"])
          }
        }
        this.projects[key].contentLoaded = true
        await putLocalProject(toRaw(this.projects[key]))
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
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
        const metaData = project.syncedAt ?
          { name: project.name, updated: Timestamp.now() } :
          { name: project.name, created: Timestamp.now(), updated: Timestamp.now() }
        const batch = writeBatch(db)
        batch.set(projectRef(this.user.uid, key), metaData, { merge: true })
        batch.set(fileRef(this.user.uid, key, "css"), { value: project.css })
        batch.set(fileRef(this.user.uid, key, "html"), { value: project.html })
        batch.set(fileRef(this.user.uid, key, "javascript"), { value: project.javascript })
        await batch.commit()
        this.projects[key].syncedAt = Date.now()
        this.projects[key].contentLoaded = true
        await putLocalProject(toRaw(this.projects[key]))
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async deleteProject({ key }: { key: string }) {
      try {
        const synced = this.projects[key]?.syncedAt
        delete this.projects[key]
        await deleteLocalProject(key)
        if (this.user && synced) {
          const batch = writeBatch(db)
          batch.delete(projectRef(this.user.uid, key))
          batch.delete(fileRef(this.user.uid, key, "css"))
          batch.delete(fileRef(this.user.uid, key, "html"))
          batch.delete(fileRef(this.user.uid, key, "javascript"))
          batch.commit().catch((e) => {
            console.log(e instanceof Error ? e.message : e)
          })
        }
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async updateProject({ key, name, value }: { key: string; name: keyof ProjectData; value: string }) {
      try {
        this.projects[key][name] = value
        this.projects[key].updated = Date.now()
        await putLocalProject(toRaw(this.projects[key]))
        const synced = this.projects[key].syncedAt
        if (this.user && synced) {
          if (name === "name") {
            updateDoc(projectRef(this.user.uid, key), { name: value, updated: Timestamp.now() }).catch((e) => {
              console.log(e instanceof Error ? e.message : e)
            })
          } else {
            updateDoc(fileRef(this.user.uid, key, name), { value }).catch((e) => {
              console.log(e instanceof Error ? e.message : e)
            })
            updateDoc(projectRef(this.user.uid, key), { updated: Timestamp.now() }).catch((e) => {
              console.log(e instanceof Error ? e.message : e)
            })
          }
        }
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async signIn() {
      try {
        await signInWithRedirect(auth, new GoogleAuthProvider())
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    signOut() {
      signOut(auth)
    },
  },
})
