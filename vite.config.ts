import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA as pwa } from "vite-plugin-pwa"
import { version } from "./package.json"

export default defineConfig({
  define: {
    VERSION: JSON.stringify(version),
  },
  plugins: [
    vue(),
    pwa({
      manifest: false,
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png}"],
        navigateFallbackDenylist: [/^\/__\//],
      },
    }),
  ],
})
