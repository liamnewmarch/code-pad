import { collection, doc, getDocs, Timestamp, updateDoc, writeBatch } from "firebase/firestore"

import { db } from "../firebase.js"
import { fileTypes, isFileType, type FileType, type Project } from "../types/project.js"

export interface RemoteProjectRow {
  key: string
  name: string
  created: number
  updated: number
  embeddedContent?: Record<FileType, string>
}

function projectsRef(uid: string) {
  return collection(db, "users", uid, "projects")
}

function projectRef(uid: string, key: string) {
  return doc(db, "users", uid, "projects", key)
}

function filesRef(uid: string, key: string) {
  return collection(db, "users", uid, "projects", key, "files")
}

function fileRef(uid: string, key: string, type: FileType) {
  return doc(db, "users", uid, "projects", key, "files", type)
}

export function generateId(): string {
  return doc(collection(db, "_ids")).id
}

function toStr(v: unknown): string {
  return typeof v === "string" ? v : ""
}

function toMillis(v: unknown): number {
  return v instanceof Timestamp ? v.toMillis() : Date.now()
}

export async function fetchProjects(uid: string): Promise<RemoteProjectRow[]> {
  const result = await getDocs(projectsRef(uid))
  const rows: RemoteProjectRow[] = []
  for (const snapshot of result.docs) {
    const d = snapshot.data()
    const row: RemoteProjectRow = {
      key: snapshot.id,
      name: toStr(d["name"]),
      created: toMillis(d["created"]),
      updated: toMillis(d["updated"]),
    }
    if (typeof d["css"] === "string") {
      row.embeddedContent = { css: toStr(d["css"]), html: toStr(d["html"]), javascript: toStr(d["javascript"]) }
    }
    rows.push(row)
  }
  return rows
}

export interface RemoteFiles {
  files: Partial<Record<FileType, string>>
  fromCache: boolean
}

export async function fetchProjectFiles(uid: string, key: string): Promise<RemoteFiles> {
  const result = await getDocs(filesRef(uid, key))
  const files: Partial<Record<FileType, string>> = {}
  for (const snapshot of result.docs) {
    const type = snapshot.id
    if (isFileType(type)) files[type] = toStr(snapshot.data()["value"])
  }
  return { files, fromCache: result.metadata.fromCache }
}

export async function pushProject(
    uid: string, key: string, project: Project, { isNew }: { isNew: boolean },
): Promise<void> {
  const batch = writeBatch(db)
  const metaData: { name: string; created?: Timestamp; updated: Timestamp } = {
    name: project.name,
    updated: Timestamp.now(),
  }
  if (isNew) metaData.created = Timestamp.now()
  batch.set(projectRef(uid, key), metaData, { merge: true })
  for (const type of fileTypes) {
    batch.set(fileRef(uid, key, type), { value: project[type] })
  }
  await batch.commit()
}

export async function pushProjectName(uid: string, key: string, name: string): Promise<void> {
  await updateDoc(projectRef(uid, key), { name, updated: Timestamp.now() })
}

export async function pushProjectFile(uid: string, key: string, type: FileType, value: string): Promise<void> {
  await updateDoc(fileRef(uid, key, type), { value })
  await updateDoc(projectRef(uid, key), { updated: Timestamp.now() })
}

export async function removeProject(uid: string, key: string): Promise<void> {
  const batch = writeBatch(db)
  batch.delete(projectRef(uid, key))
  for (const type of fileTypes) {
    batch.delete(fileRef(uid, key, type))
  }
  await batch.commit()
}

export async function migrateLegacyProject(uid: string, key: string, project: Project): Promise<void> {
  const batch = writeBatch(db)
  batch.set(projectRef(uid, key), {
    name: project.name,
    created: Timestamp.fromMillis(project.created),
    updated: Timestamp.fromMillis(project.updated),
  })
  for (const type of fileTypes) {
    batch.set(fileRef(uid, key, type), { value: project[type] })
  }
  await batch.commit()
}
