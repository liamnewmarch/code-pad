import { createPinia, defineStore } from "pinia"

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

export const pinia = createPinia()

const defaultData = {
  css: "html {\n  background-color: #111;\n  color: #fff;\n}\n",
  html: "<p> Hello, world! </p>\n",
  javascript: "const p = document.querySelector('p');\n",
  name: "Untitled",
}

const projectsRef = (uid) => collection(db, "users", uid, "projects")
const projectRef = (uid, key) => doc(db, "users", uid, "projects", key)

export const useProjectStore = defineStore("projects", {
  state: () => ({
    loading: true,
    projects: {},
    user: null,
  }),
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
          this.loadProjects()
        } else {
          this.user = null
          this.loading = false
        }
      })
    },
    async loadProjects() {
      try {
        const result = await getDocs(projectsRef(this.user.uid))
        for (const snapshot of result.docs) {
          this.projects[snapshot.id] = {
            ...snapshot.data(), key: snapshot.id,
          }
        }
        this.loading = false
      } catch ({ message }) {
        console.log(message)
      }
    },
    async addProject(data = defaultData) {
      try {
        const project = { ...data }
        project.created = project.updated = Timestamp.now()
        const snapshot = await addDoc(projectsRef(this.user.uid), project)
        this.projects[snapshot.id] = { ...project, key: snapshot.id }
        return snapshot.id
      } catch ({ message }) {
        console.log(message)
      }
    },
    async deleteProject({ key }) {
      try {
        await deleteDoc(projectRef(this.user.uid, key))
        delete this.projects[key]
      } catch ({ message }) {
        console.log(message)
      }
    },
    async updateProject({ key, name, value }) {
      try {
        this.projects[key][name] = value
        await updateDoc(projectRef(this.user.uid, key), {
          [name]: value,
          updated: Timestamp.now(),
        })
      } catch ({ message }) {
        console.log(message)
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
