<script>
export default {
  data() {
    return { json: '' };
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
  },
  methods: {
    async add() {
      const key = await this.$store.dispatch('addProject');
      this.$router.push({ name: 'editor', params: { key, type: 'html' } });
    },
    async importJSON() {
      try {
        const project = JSON.parse(this.json);
        const key = await this.$store.dispatch('addProject', project);
        this.$router.push({ name: 'editor', params: { key, type: 'html' } });
      } catch (error) {
        /* eslint-disable-next-line no-restricted-globals, no-alert */
        alert(error);
      }
    },
  },
};
</script>

<style>
.start__items,
.start__import {
  display: flex;
  flex-flow: row wrap;
  flex-shrink: 0;
  padding: 1rem 0 0 1rem;
}

.start__item,
.start__import-button {
  background: #444;
  border-radius: .2rem;
  flex: 1 0 8rem;
  margin: 0 1rem 1rem 0;
  padding: 3rem 1rem;
  text-align: center;
}

.start__item--add,
.start__import-button {
  background-color: #333;
}

.start__import-input {
  flex: 1 0 8rem;
  margin: 0 1rem 1rem 0;
  padding: 3rem 1rem;
  text-align: center;
}
</style>

<template>
  <!-- TODO rename `start` to list -->
  <section class="view start">
    <div class="start__items">
      <router-link
        v-for="(project, index) in projects"
        :key="index"
        class="start__item button"
        tag="button"
        :to="{ name: 'editor', params: { key: project.key, type: 'html' }}"
      >{{ project.name }}</router-link>
      <button
        class="start__item start__item--add"
        @click="add"
      > Add </button>
    </div>
    <div class="start__import">
      <input
        v-model="json"
        class="start__import-input"
        placeholder="Import from JSON"
        type="text"
      >
      <button
        class="start__import-button"
        @click="importJSON"
      > Import </button>
    </div>
  </section>
</template>
