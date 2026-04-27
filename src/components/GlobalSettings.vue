<script setup>
import { computed, ref } from "vue"
import { useProjectStore } from "../config/store.js"
import ModalDialog from "./ModalDialog.vue"
import getUnmigratedProjects from "../config/migrate/index.js"

const store = useProjectStore()
const modal = ref(null)
const confirm = ref(null)
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
  } catch (error) {
    showModal(`There was an error:\n"${error.message}"`)
  }
}

async function migrate() {
  const { count, migrate: doMigrate } = getUnmigratedProjects()
  if (count) {
    modalText.value = `Found ${count} project(s). Migrate?`
    if (await confirm.value.show()) {
      doMigrate()
    }
    showModal(`Success! Imported ${count} project(s).`)
  } else {
    showModal("No projects found to migrate.")
  }
}

async function signOut() {
  await store.signOut()
}

async function showModal(text) {
  modalText.value = text
  return await modal.value.show()
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
    <h2> Migrate </h2>
    <button
      class="global-settings__button"
      @click="migrate"
    >
      Migrate old data
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
    <ModalDialog
      ref="confirm"
      :buttons="[{
        label: 'Migrate',
        value: true,
      }, {
        label: 'Dismiss',
        value: false,
      }]"
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
