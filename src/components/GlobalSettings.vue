<script setup lang="ts">
import { computed, ref } from "vue"
import { useProjectStore } from "../config/store.js"
import ModalDialog from "./ModalDialog.vue"

const store = useProjectStore()
const modal = ref<InstanceType<typeof ModalDialog>>()
const modalText = ref("")
const version = VERSION

const year = computed(() => {
  try {
    return new Intl.DateTimeFormat("en", { year: "numeric" }).format()
  } catch {
    return new Date().getFullYear()
  }
})

async function exportJSON() {
  const projects = Object.values(store.projects)
  const json = JSON.stringify(projects)
  await navigator.clipboard.writeText(json)
  showModal("Projects copied to clipboard.")
}

async function importJSON() {
  try {
    const json = await navigator.clipboard.readText()
    const projects = JSON.parse(json)
    for (const project of projects) {
      await store.addProject(project)
    }
    showModal(`Success! Imported ${projects.length} project(s).`)
  } catch (e) {
    showModal(`There was an error:\n"${e instanceof Error ? e.message : e}"`)
  }
}

async function signOut() {
  await store.signOut()
}

async function showModal(text: string) {
  modalText.value = text
  return modal.value?.show()
}
</script>

<template>
  <section class="global-settings__container">
    <h2> Export all projects </h2>
    <button
      class="global-settings__button"
      @click="exportJSON"
    >
      Export to clipboard
    </button>
    <h2> Import project(s) </h2>
    <button
      class="global-settings__button"
      @click="importJSON"
    >
      Import from clipboard
    </button>
    <h2> Sign out </h2>
    <button
      class="global-settings__button"
      @click="signOut"
    >
      Sign out from Code Pad
    </button>
    <h2>About</h2>
    <p>Code Pad version {{ version }}</p>
    <p>© {{ year }} Liam Newmarch</p>
    <ModalDialog
      ref="modal"
      :buttons="[{ label: 'Dismiss', value: true }]"
      :text="modalText"
    />
  </section>
</template>

<style>
.global-settings__container {
  padding: 1rem;
}

.global-settings__button {
  border: 1px solid #fff4;
  border-radius: .2rem;
  padding: 1rem 2rem;
}
</style>
