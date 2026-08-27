<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useProjectStore } from "../stores/project.js"
import { stringParam } from "../utils.js"
import LoadingState from "./LoadingState.vue"

const store = useProjectStore()
const route = useRoute()
const router = useRouter()

const key = computed(() => stringParam(route.params.key))
const project = computed(() => store.projects[key.value])
const ready = ref(false)

watch(key, async (currentKey) => {
  ready.value = false
  const current = store.projects[currentKey]
  if (!current) {
    router.push({ name: "list" })
    return
  }
  if (!current.contentLoaded) {
    await store.loadProjectContent(currentKey)
  }
  ready.value = true
}, { immediate: true })
</script>

<template>
  <LoadingState v-if="!ready" />
  <RouterView
    v-else
    :project="project"
  />
</template>
