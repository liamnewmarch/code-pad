export interface Project {
  css: string
  html: string
  javascript: string
  name: string
  created: number
  updated: number
  key: string
  cloudId?: string
  syncedAt?: number
}

export type ProjectData = Pick<Project, "css" | "html" | "javascript" | "name">
