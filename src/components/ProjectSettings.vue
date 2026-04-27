<script setup>
import { ref } from "vue"
import { useProjectStore } from "../config/store.js"
import ModalDialog from "./ModalDialog.vue"

const props = defineProps({
  project: {
    default: null,
    type: Object,
  },
})

const store = useProjectStore()
const modalCopied = ref(null)
const modalDelete = ref(null)

const modalCopiedButtons = [{ label: "Dismiss" }]
const modalDeleteButtons = [{
  label: "Cancel",
  value: false,
}, {
  danger: true,
  label: "Delete",
  value: true,
}]

async function copyToClipboard() {
  const json = JSON.stringify([{ ...props.project }])
  await navigator.clipboard.writeText(json)
  modalCopied.value.show()
}

async function deleteProject() {
  const value = await modalDelete.value.show()
  if (!value) return
  await store.deleteProject({ key: props.project.key })
}

async function updateName(event) {
  await store.updateProject({
    key: props.project.key,
    name: "name",
    value: event.target.value,
  })
}
</script>

<template>
  <section
    class="view settings"
    ng-if="vm.view === 'settings'"
  >
    <div class="settings__items">
      <div class="settings__item">
        <label class="settings__label">
          Project name
        </label>
        <input
          :value="project.name"
          class="settings__input"
          @input="updateName"
        >
      </div>
      <div class="settings__item">
        <button
          class="settings__button"
          @click.prevent="copyToClipboard"
        >
          Copy to clipboard
        </button>
        <button
          class="settings__button settings__button--delete"
          @click.prevent="deleteProject"
        >
          Delete
        </button>
      </div>
    </div>
    <ModalDialog
      ref="modalCopied"
      :buttons="modalCopiedButtons"
      text="Project copied to clipboard."
    />
    <ModalDialog
      ref="modalDelete"
      :buttons="modalDeleteButtons"
      text="Are you sure you want to delete this project?"
    />
  </section>
</template>


<style>
.settings__items {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

.settings__item {
  align-items: center;
  display: flex;
  margin: 1rem 0;
}

.settings__label {
  flex-shrink: 0;
}

.settings__input {
  background: #333;
  margin-left: 1rem;
  padding: 1rem;
  width: 100%;
}

.settings__button {
  background-color: #444;
  border-radius: .2rem;
  flex: 1 0 auto;
  padding: 1rem;
  text-align: center;
}

.settings__button--delete {
  background: #a22;
  margin-left: 1rem;
}
</style>
