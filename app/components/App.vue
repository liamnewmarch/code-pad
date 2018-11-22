<script>
import Header from './Header.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style>
*,
*::after,
*::before {
  box-sizing: inherit;
}

html {
  background-color: #272822;
  box-sizing: border-box;
  color: #fff;
  font: 16px / 1.2 Roboto Mono, monospace;
  text-rendering: optimizeLegibility;
}

body {
  display: flex;
  flex-direction: column;
  margin: 0;
  min-height: 100vh;
}

button,
input {
  all: unset;
}

.view {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>

<template>
  <div
    class="view"
    :class="`view--${$route.name} ${$route.name}`"
  >
    <Header />
    <router-view />
  </div>
</template>
