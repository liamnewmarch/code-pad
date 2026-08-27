import type { Timestamp } from "firebase/firestore"

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
