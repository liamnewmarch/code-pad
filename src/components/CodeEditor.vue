<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"
import { useProjectStore } from "../config/store.js"
import { createEditor } from "../config/editor.js"

const props = defineProps({
  project: {
    default: null,
    type: Object,
  },
})

const store = useProjectStore()
const route = useRoute()
const editorEl = ref(null)
const type = computed(() => route.params.type)

let editor

async function onChange() {
  await store.updateProject({
    key: route.params.key,
    name: type.value,
    value: editor.getValue(),
  })
}

function onTypeChange(t = type.value) {
  editor.setLanguage(t)
  editor.setValue(props.project[t])
}

onBeforeRouteUpdate((to, from, next) => {
  onTypeChange(to.params.type)
  next()
})

onMounted(() => {
  editor = createEditor(editorEl.value, {
    onChange,
    getType: () => type.value,
  })
  onTypeChange()
})

onUnmounted(() => {
  if (editor) editor.destroy()
})
</script>

<template>
  <div class="editor">
    <div
      ref="editorEl"
      class="editor__cm"
    />
  </div>
</template>

<style>
.editor {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  min-height: 0;
}

.editor__cm {
  display: flex;
  flex: 1 0 0;
  min-height: 0;
  overflow: hidden;
}

.editor__cm .cm-editor {
  background-color: #111;
  flex: 1 0 0;
  font-size: 16px;
  line-height: 1.2;
  overflow: hidden;
}

.editor__cm .cm-scroller {
  flex: 1 0 0;
  overflow: auto;
  padding: 1rem;
}
</style>
