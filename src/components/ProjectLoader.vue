<script>
export default {
  methods: {
    getProjectOrNavigate() {
      if (this.$route.params.key in this.$store.state.projects) {
        return this.$store.state.projects[this.$route.params.key];
      }
      this.$router.push({ name: 'list' });
    },
  },
};
</script>

<template>
  <RouterView :project="getProjectOrNavigate()" />
</template>
