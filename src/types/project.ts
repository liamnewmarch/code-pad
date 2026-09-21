export const fileTypes = ["css", "html", "javascript"] as const

export type FileType = typeof fileTypes[number]

export function isFileType(value: string): value is FileType {
  return fileTypes.some((type) => type === value)
}

export interface Project {
  css: string
  html: string
  javascript: string
  name: string
  created: number
  updated: number
  key: string
  syncedAt?: number
  contentLoaded: boolean
}

export type ProjectData = Pick<Project, "css" | "html" | "javascript" | "name">
