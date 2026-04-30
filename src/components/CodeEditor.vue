<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
import { onBeforeRouteUpdate, useRoute } from "vue-router"
import { useProjectStore } from "../config/store.js"
import { createEditor } from "../config/editor.js"
import { stringParam, toLangKey } from "../config/utils.js"
import type { Project } from "../config/store.js"
import type { LangKey } from "../config/editor.js"

const props = defineProps<{ project?: Project }>()

const store = useProjectStore()
const route = useRoute()
const editorEl = ref<HTMLElement>()
const editor = ref<ReturnType<typeof createEditor>>()
const type = computed(() => toLangKey(stringParam(route.params.type)))

async function onChange() {
  if (!editor.value) return
  await store.updateProject({
    key: stringParam(route.params.key),
    name: type.value,
    value: editor.value.getValue(),
  })
}

function onTypeChange(t: LangKey = type.value) {
  if (!editor.value || !props.project) return
  editor.value.setLanguage(t)
  editor.value.setValue(props.project[t])
}

onBeforeRouteUpdate((to) => {
  onTypeChange(toLangKey(stringParam(to.params.type)))
})

onMounted(() => {
  if (!editorEl.value) return
  editor.value = createEditor(editorEl.value, {
    onChange,
    getType: () => type.value,
  })
  onTypeChange()
})

onUnmounted(() => {
  editor.value?.destroy()
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
