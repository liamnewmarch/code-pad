import { isFileType, type FileType } from "./types/project.js"

export function stringParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? "" : value
}

export function toLangKey(value: string): FileType {
  if (isFileType(value)) return value
  return "html"
}
