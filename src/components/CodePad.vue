<script>
import AppHeader from './AppHeader.vue';
import LoadingState from './LoadingState.vue';
import SignIn from './SignIn.vue';

export default {
  components: {
    AppHeader,
    LoadingState,
    SignIn,
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    user() {
      return this.$store.state.user;
    },
  },
  async created() {
    await this.$store.dispatch('init');
  },
};
</script>

<template>
  <div
    class="view"
    :class="`view--${$route.name} ${$route.name}`"
  >
    <LoadingState v-if="loading" />
    <AppHeader v-if="!loading && user" />
    <RouterView v-if="!loading && user" />
    <SignIn v-if="!loading && !user" />
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
  min-height: 100vh;
  overscroll-behavior: none;
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
