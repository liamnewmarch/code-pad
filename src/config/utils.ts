import type { LangKey } from "./editor.js"

export function stringParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? "" : value
}

export function toLangKey(value: string): LangKey {
  if (value === "css" || value === "html" || value === "javascript") return value
  return "html"
}
