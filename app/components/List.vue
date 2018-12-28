<script>
import Modal from './Modal.vue';

export default {
  data() {
    return {
      importError: '',
      json: '',
    };
  },
  components: {
    Modal,
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
        this.importError = `There was an error importing the project: “${error.message}”`;
        this.$refs.modal.show();
      }
    },
    reverse(object) {
      return Object.entries(object).reverse().reduce((obj, [key, value]) => {
        return Object.assign(obj, { [key]: value })
      }, {});
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
      <button
        class="list__item list__item--add"
        @click="add"
      > New project </button>
      <router-link
        v-for="(project, index) in reverse($store.state.projects)"
        :key="index"
        class="list__item button"
        tag="button"
        :to="{ name: 'editor', params: { key: project.key, type: 'html' }}"
      >{{ project.name }}</router-link>
    </div>
    <div class="list__import">
      <input
        v-model="json"
        class="list__import-input"
        placeholder="Paste JSON"
        type="text"
      >
      <button
        class="list__import-button"
        @click="importJSON"
      > Import project </button>
    </div>
    <Modal :buttons="[{ label: 'Dismiss', value: true }]" ref="modal" :text="importError" />
  </section>
</template>
