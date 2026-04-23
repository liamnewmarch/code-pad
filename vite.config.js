import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA as pwa } from "vite-plugin-pwa"
import { version } from "./package.json"

export default defineConfig({
  plugins: [
    vue(),
    pwa({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png}"],
      },
      manifest: false,
    }),
  ],
  define: {
    VERSION: JSON.stringify(version),
  },
})
