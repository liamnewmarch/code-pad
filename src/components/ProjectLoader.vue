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
const ready = computed(() => project.value?.contentLoaded ?? false)
const failed = ref(false)

async function load(currentKey: string) {
  const current = store.projects[currentKey]
  if (!current) {
    router.push({ name: "list" })
    return
  }
  failed.value = false
  if (!current.contentLoaded) {
    failed.value = !(await store.loadProjectContent(currentKey))
  }
}

function retry() {
  load(key.value)
}

watch(key, load, { immediate: true })
</script>

<template>
  <LoadingState v-if="!ready && !failed" />
  <div
    v-else-if="failed"
    class="loading"
  >
    <p> Couldn't load this project's code. </p>
    <button
      class="settings__button"
      @click="retry"
    >
      Retry
    </button>
  </div>
  <RouterView
    v-else
    :project="project"
  />
</template>

<style>
.loading .settings__button {
  margin-top: 1rem;
  max-width: 12rem;
}
</style>
