<script>
import Vuex from 'vuex';
import store from '../config/store';

export default {
  beforeRouteEnter(to, from, next) {
    if (to.params.key in store.state.projects) {
      next();
    } else {
      next({ name: 'list' });
    }
  },
  computed: {
    project() {
      return this.$store.state.projects[this.$route.params.key];
    },
  },
}
</script>


<style>
.project__pane {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}

.project__pane .CodeMirror,
.project__result {
  background-color: #272822;
  border: 0;
  color: #fff;
  height: 100vh;
  flex-basis: 100%;
  flex-grow: 1;
  position: relative;
  width: 100%;
}

.project__pane .CodeMirror {
  line-height: inherit;
}

.project__pane .CodeMirror-scroll {
  box-sizing: inherit;
  height: 100%;
  left: 0;
  padding: 1rem;
  position: absolute;
  top: 0;
  width: 100%;
}

.project__pane .CodeMirror-sizer {
  border-right-width: 1rem;
}
</style>

<template>
  <router-view :project="project" />
</template>
