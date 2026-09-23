<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useProjectStore } from "../stores/project.js"

const store = useProjectStore()
const router = useRouter()
const filterText = ref("")

const projectCount = computed(() => Object.keys(store.projects).length)

// Newest first, filtered by name against the filter box.
const visibleProjects = computed(() => {
  const lower = filterText.value.trim().toLowerCase()
  const projects = Object.values(store.projects).filter((project) => {
    return lower ? project.name.trim().toLowerCase().includes(lower) : true
  })
  return projects.sort((a, b) => b.created - a.created)
})

async function add() {
  const key = await store.addProject()
  if (key) router.push({ name: "editor", params: { key, type: "html" }})
}
</script>

<template>
  <section class="view list">
    <input
      v-if="projectCount > 12"
      v-model="filterText"
      aria-label="Filter projects"
      class="list__filter"
      placeholder="Filter projects"
      type="text"
    >
    <div class="list__items">
      <button
        class="list__item list__item--add"
        @click="add"
      >
        New project
      </button>
      <RouterLink
        v-for="project of visibleProjects"
        :key="project.key"
        class="list__item button"
        :to="{ name: 'editor', params: { key: project.key, type: 'html' }}"
      >
        {{ project.name }}
        <span
          v-if="project.syncedAt"
          aria-label="Saved to account"
          class="list__item-sync"
        >☁</span>
      </RouterLink>
    </div>
  </section>
</template>

<style>
.list__filter {
  border: 1px solid #fff4;
  border-radius: .2rem;
  margin: 1rem;
  padding: 1rem 2rem;
}

.list__filter:focus {
  border: 1px solid #fff;
}

.list__items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  padding: 1rem 0 0 1rem;
}

.list__item {
  background: #444;
  border-radius: .2rem;
  color: inherit;
  flex: 1 0 8rem;
  hyphens: auto;
  margin: 0 1rem 1rem 0;
  padding: 3rem 1rem;
  position: relative;
  text-align: center;
  text-decoration: none;
  word-break: break-all;
}

.list__item--add {
  background-color: #333;
}

.list__item-sync {
  opacity: .6;
  position: absolute;
  right: .5rem;
  top: .5rem;
}
</style>
