<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { useProjectStore } from "../config/store.js"
import { stringParam } from "../config/utils.js"

const store = useProjectStore()
const route = useRoute()
const router = useRouter()

function getProjectOrNavigate() {
  const key = stringParam(route.params.key)
  if (key in store.projects) {
    return store.projects[key]
  }
  router.push({ name: "list" })
}
</script>

<template>
  <RouterView :project="getProjectOrNavigate()" />
</template>
