<script>
import { useProjectStore } from '../config/store.js';

export default {
  setup() {
    return { store: useProjectStore() };
  },
  methods: {
    getProjectOrNavigate() {
      if (this.$route.params.key in this.store.projects) {
        return this.store.projects[this.$route.params.key];
      }
      this.$router.push({ name: 'list' });
    },
  },
};
</script>

<template>
  <RouterView :project="getProjectOrNavigate()" />
</template>
