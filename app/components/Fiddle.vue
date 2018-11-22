<script>
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
};
</script>


<style>
.project__pane {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}

.project__pane,
.project__result {
  background-color: #272822;
  border: 0;
  color: #fff;
  flex-basis: 100%;
  flex-grow: 1;
  position: relative;
  width: 100%;
}
</style>

<template>
  <router-view :project="project" />
</template>
