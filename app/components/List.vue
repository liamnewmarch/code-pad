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
.list__items,
.list__import {
  display: flex;
  flex-flow: row wrap;
  flex-shrink: 0;
  padding: 1rem 0 0 1rem;
}

.list__item,
.list__import-button {
  background: #444;
  border-radius: .2rem;
  flex: 1 0 8rem;
  margin: 0 1rem 1rem 0;
  padding: 3rem 1rem;
  text-align: center;
}

.list__item--add,
.list__import-button {
  background-color: #333;
}

.list__import-input {
  flex: 1 0 8rem;
  margin: 0 1rem 1rem 0;
  padding: 3rem 1rem;
  text-align: center;
}
</style>

<template>
  <section class="view list">
    <div class="list__items">
      <router-link
        v-for="(project, index) in projects"
        :key="index"
        class="list__item button"
        tag="button"
        :to="{ name: 'editor', params: { key: project.key, type: 'html' }}"
      >{{ project.name }}</router-link>
      <button
        class="list__item list__item--add"
        @click="add"
      > Add </button>
    </div>
    <div class="list__import">
      <input
        v-model="json"
        class="list__import-input"
        placeholder="Import from JSON"
        type="text"
      >
      <button
        class="list__import-button"
        @click="importJSON"
      > Import </button>
    </div>
  </section>
</template>
