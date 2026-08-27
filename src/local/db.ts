import { openDB, type DBSchema } from "idb"
import type { Project } from "../types/project.js"

interface CodePadDB extends DBSchema {
  projects: {
    key: string
    value: Project
  }
}

const dbPromise = openDB<CodePadDB>("code-pad", 1, {
  upgrade(db) {
    db.createObjectStore("projects", { keyPath: "key" })
  },
})

export async function getAllLocalProjects(): Promise<Project[]> {
  return (await dbPromise).getAll("projects")
}

export async function putLocalProject(project: Project): Promise<void> {
  await (await dbPromise).put("projects", project)
}

export async function deleteLocalProject(key: string): Promise<void> {
  await (await dbPromise).delete("projects", key)
}
