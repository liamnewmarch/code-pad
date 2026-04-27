<script setup>
import { useRoute } from "vue-router"
import { useProjectStore } from "../config/store.js"
import AppHeader from "./AppHeader.vue"
import LoadingState from "./LoadingState.vue"
import SignIn from "./SignIn.vue"

const route = useRoute()
const store = useProjectStore()
store.init()
</script>

<template>
  <div
    class="view"
    :class="`view--${route.name} ${route.name}`"
  >
    <LoadingState v-if="store.loading" />
    <AppHeader v-if="!store.loading && store.user" />
    <RouterView v-if="!store.loading && store.user" />
    <SignIn v-if="!store.loading && !store.user" />
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
  overscroll-behavior: none;
}

code-pad {
  display: contents;
}

button,
input {
  all: unset;
}

.view {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  min-height: 0;
}
</style>
