<script setup lang="ts">
import { useRoute } from "vue-router"
import { useProjectStore } from "../stores/project.js"
import AppHeader from "./AppHeader.vue"
import LoadingState from "./LoadingState.vue"

const route = useRoute()
const store = useProjectStore()
store.init()
</script>

<template>
  <div
    class="view"
    :class="`view--${String(route.name)} ${String(route.name)}`"
  >
    <LoadingState v-if="store.loading" />
    <template v-else>
      <AppHeader />
      <RouterView />
    </template>
  </div>
</template>

<style>
*,
*::after,
*::before {
  box-sizing: inherit;
}

html {
  background-color: #111;
  box-sizing: border-box;
  color: #fff;
  font-family: system-ui, sans-serif;
  text-rendering: geometricPrecision;
}

body {
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100dvh;
  overscroll-behavior: contain;
  touch-action: manipulation;
}

code-pad {
  display: contents;
}

button,
input {
  all: unset;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.view {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  min-height: 0;
}
</style>
