<script setup>
import { useRoute, useRouter } from "vue-router"
import { useProjectStore } from "../config/store.js"

const store = useProjectStore()
const route = useRoute()
const router = useRouter()

function getProjectOrNavigate() {
  if (route.params.key in store.projects) {
    return store.projects[route.params.key]
  }
  router.push({ name: "list" })
}
</script>

<template>
  <RouterView :project="getProjectOrNavigate()" />
</template>
