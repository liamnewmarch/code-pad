import { createPinia, defineStore } from "pinia"
import type { User } from "firebase/auth"

import {
  addDoc,
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  getDocs,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  Timestamp,
  updateDoc,
} from "./firebase.js"

export interface Project {
  css: string
  html: string
  javascript: string
  name: string
  created: Timestamp
  updated: Timestamp
  key: string
}

export type ProjectData = Pick<Project, "css" | "html" | "javascript" | "name">

export const pinia = createPinia()

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

function toTimestamp(v: unknown): Timestamp {
  return v instanceof Timestamp ? v : Timestamp.now()
}

export const useProjectStore = defineStore("projects", {
  state: (): { loading: boolean; projects: Record<string, Project>; user?: User } => ({
    loading: true,
    projects: {},
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
          this.loadProjects()
        } else {
          delete this.user
          this.loading = false
        }
      })
    },
    async loadProjects() {
      if (!this.user) return
      try {
        const result = await getDocs(projectsRef(this.user.uid))
        for (const snapshot of result.docs) {
          const d = snapshot.data()
          this.projects[snapshot.id] = {
            key: snapshot.id,
            name: toStr(d["name"]),
            css: toStr(d["css"]),
            html: toStr(d["html"]),
            javascript: toStr(d["javascript"]),
            created: toTimestamp(d["created"]),
            updated: toTimestamp(d["updated"]),
          }
        }
        this.loading = false
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async addProject(data: ProjectData = defaultData) {
      if (!this.user) return
      try {
        const project = {
          ...data,
          created: Timestamp.now(),
          updated: Timestamp.now(),
        }
        const snapshot = await addDoc(projectsRef(this.user.uid), project)
        this.projects[snapshot.id] = { ...project, key: snapshot.id }
        return snapshot.id
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async deleteProject({ key }: { key: string }) {
      if (!this.user) return
      try {
        await deleteDoc(projectRef(this.user.uid, key))
        delete this.projects[key]
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    async updateProject({ key, name, value }: { key: string; name: keyof ProjectData; value: string }) {
      if (!this.user) return
      try {
        this.projects[key][name] = value
        await updateDoc(projectRef(this.user.uid, key), {
          [name]: value,
          updated: Timestamp.now(),
        })
      } catch (e) {
        console.log(e instanceof Error ? e.message : e)
      }
    },
    signIn() {
      signInWithRedirect(auth, new GoogleAuthProvider())
    },
    signOut() {
      signOut(auth)
    },
  },
})
