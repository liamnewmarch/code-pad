<script>
export default {
  computed: {
    fiddles() {
      return this.$store.state.fiddles;
    },
  },
  data() {
    return { json: '' };
  },
  methods: {
    add() {
      this.$store.dispatch('addFiddle');
    },
    importJSON() {
      try {
        const fiddle = JSON.parse(this.json);
        this.$store.dispatch('addFiddle', fiddle);
        this.json = '';
      } catch (error) {
        alert(error);
      }
    }
  }
}
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
        class="start__item button"
        tag="button"
        v-for="(fiddle, index) in fiddles"
        :key="index"
        :to="{ name: 'editor', params: { key: fiddle.key, type: 'html' }}"
      >{{ fiddle.name }}</router-link>
      <button
        class="start__item start__item--add"
        @click="add"> Add </button>
    </div>
    <div class="start__import">
      <input
        class="start__import-input"
        placeholder="Import from JSON"
        type="text"
        v-model="json">
      <button
        class="start__import-button"
        @click="importJSON"> Import </button>
    </div>
  </section>
</template>
