import { defineStore } from "pinia"
import { toRaw } from "vue"
import type { User } from "firebase/auth"
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth"
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore"

import { auth, db } from "../firebase.js"
import { deleteLocalProject, getAllLocalProjects, putLocalProject } from "../local/db.js"
import type { Project, ProjectData } from "../types/project.js"

const defaultData: ProjectData = {
  css: "html {\n  background-color: #111;\n  color: #fff;\n}\n",
  html: "<p> Hello, world! </p>\n",
  javascript: "const p = document.querySelector('p');\n",
  name: "Untitled",
}

const projectsRef = (uid: string) => collection(db, "users", uid, "projects")
const projectRef = (uid: string, key: string) => doc(db, "users", uid, "projects", key)

function toStr(v: unknown): string {
  return typeof v === "string" ? v : ""
}

function toMillis(v: unknown): number {
  return v instanceof Timestamp ? v.toMillis() : Date.now()
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
        for (const snapshot of result.docs) {
          const d = snapshot.data()
          const project: Project = {
            key: snapshot.id,
            name: toStr(d["name"]),
            css: toStr(d["css"]),
            html: toStr(d["html"]),
            javascript: toStr(d["javascript"]),
            created: toMillis(d["created"]),
            updated: toMillis(d["updated"]),
            cloudId: snapshot.id,
            syncedAt: Date.now(),
          }
          this.projects[snapshot.id] = project
          await putLocalProject(project)
        }
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
        key: crypto.randomUUID(),
      }
      try {
        this.projects[project.key] = project
        await putLocalProject(project)
        return project.key
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
        const data = { name: project.name, css: project.css, html: project.html, javascript: project.javascript }
        if (project.cloudId) {
          await updateDoc(projectRef(this.user.uid, project.cloudId), { ...data, updated: Timestamp.now() })
        } else {
          const snapshot = await addDoc(projectsRef(this.user.uid), {
            ...data,
            created: Timestamp.now(),
            updated: Timestamp.now(),
          })
          this.projects[key].cloudId = snapshot.id
        }
        this.projects[key].syncedAt = Date.now()
        await putLocalProject(toRaw(this.projects[key]))
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async deleteProject({ key }: { key: string }) {
      try {
        const cloudId = this.projects[key]?.cloudId
        delete this.projects[key]
        await deleteLocalProject(key)
        if (this.user && cloudId) {
          deleteDoc(projectRef(this.user.uid, cloudId)).catch((e) => {
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
        const cloudId = this.projects[key].cloudId
        if (this.user && cloudId) {
          updateDoc(projectRef(this.user.uid, cloudId), { [name]: value, updated: Timestamp.now() }).catch((e) => {
            console.log(e instanceof Error ? e.message : e)
          })
        }
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    signIn() {
      signInWithRedirect(auth, new GoogleAuthProvider()).catch((e) => {
        console.log(e instanceof Error ? e.message : e)
      })
    },
    signOut() {
      signOut(auth)
    },
  },
})
