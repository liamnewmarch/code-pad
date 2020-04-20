<script>
export default {
  computed: {
    projects() {
      return this.sort('-created', Object.values(this.$store.state.projects));
    },
  },
  methods: {
    async add() {
      const key = await this.$store.dispatch('addProject');
      this.$router.push({ name: 'editor', params: { key, type: 'html' }});
    },
    sort(key, array) {
      const ascending = key.startsWith('-');
      if (ascending) key = key.substr(1);
      const fn = ({ [key]: a }, { [key]: b }) => a < b ? -1 : a > b ? 1 : 0;
      return ascending ? array.sort(fn).reverse() : array.sort(fn);
    },
  },
};
</script>

<template>
  <section class="view list">
    <div class="list__items">
      <button
        class="list__item list__item--add"
        @click="add"
      >
        New project
      </button>
      <RouterLink
        v-for="(project, index) of projects"
        :key="index"
        class="list__item button"
        tag="button"
        :to="{ name: 'editor', params: { key: project.key, type: 'html' }}"
      >
        {{ project.name }}
      </RouterLink>
    </div>
    <div class="list__global-settings button">
      <RouterLink
        class="list__global-settings-item button"
        tag="button"
        :to="{ name: 'global-settings' }"
      >
        Settings
      </RouterLink>
    </div>
  </section>
</template>

<style>
.list__items {
  display: flex;
  flex-flow: row wrap;
  flex-shrink: 0;
  padding: 1rem 0 0 1rem;
}

.list__item {
  background: #444;
  border-radius: .2rem;
  flex: 1 0 8rem;
  margin: 0 1rem 1rem 0;
  padding: 3rem 1rem;
  text-align: center;
}

.list__item--add {
  background-color: #333;
}

.list__global-settings {
  padding: 1em;
  text-align: center;
}

.list__global-settings-item {
  color: #fff;
  text-decoration: none;
}
</style>
