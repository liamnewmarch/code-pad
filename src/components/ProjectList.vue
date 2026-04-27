<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useProjectStore } from "../config/store.js"

const store = useProjectStore()
const router = useRouter()
const filterText = ref("")

const projects = computed(() => Object.values(store.projects))

async function add() {
  const key = await store.addProject()
  router.push({ name: "editor", params: { key, type: "html" }})
}

function filter(key, text, array) {
  text = text.trim().toLowerCase()
  return array.filter((item) => {
    return text ? item[key].trim().toLowerCase().includes(text) : true
  })
}

function sort(key, array) {
  const ascending = key.startsWith("-")
  if (ascending) key = key.slice(1)
  const fn = ({ [key]: a }, { [key]: b }) => a < b ? -1 : a > b ? 1 : 0
  return ascending ? [...array].sort(fn).reverse() : [...array].sort(fn)
}
</script>

<template>
  <section class="view list">
    <input
      v-if="projects.length > 12"
      v-model="filterText"
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
        v-for="(project, index) of sort('-created', filter('name', filterText, projects))"
        :key="index"
        class="list__item button"
        :to="{ name: 'editor', params: { key: project.key, type: 'html' }}"
      >
        {{ project.name }}
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
  text-align: center;
  text-decoration: none;
  word-break: break-all;
}

.list__item--add {
  background-color: #333;
}
</style>
