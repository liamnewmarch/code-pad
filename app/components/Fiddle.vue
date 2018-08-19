<script>
import Vuex from 'vuex';
import store from '../config/store';

export default {
  beforeRouteEnter(to, from, next) {
    if (to.params.key in store.state.fiddles) {
      next();
    } else {
      next({ name: 'list' });
    }
  },
  data() {
    const fiddle = this.$store.state.fiddles[this.$route.params.key];
    return { fiddle };
  },
}
</script>


<style>
.fiddle__pane {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}

.fiddle__pane .CodeMirror,
.fiddle__result {
  background-color: #272822;
  border: 0;
  color: #fff;
  height: 100vh;
  flex-basis: 100%;
  flex-grow: 1;
  position: relative;
  width: 100%;
}

.fiddle__pane .CodeMirror {
  line-height: inherit;
}

.fiddle__pane .CodeMirror-scroll {
  box-sizing: inherit;
  height: 100%;
  left: 0;
  padding: 1rem;
  position: absolute;
  top: 0;
  width: 100%;
}

.fiddle__pane .CodeMirror-sizer {
  border-right-width: 1rem;
}
</style>

<template>
  <router-view :fiddle="fiddle" />
</template>
