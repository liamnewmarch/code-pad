/// <reference types="vite/client" />

declare const VERSION: string

interface Window {
  console: Console
  injectHandlers(win: Window): void
}
