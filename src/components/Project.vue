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
