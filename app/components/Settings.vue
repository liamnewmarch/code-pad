<script>
export default {
  data() {
    const { key } = this.$route.params;
    const fiddle = this.$store.state.fiddles[key]
    return { fiddle, key };
  },
  methods: {
    clone() {
      this.$store.dispatch('addFiddle', this.fiddle);
    },
    copyToClipboard() {
      const textarea = document.createElement('textarea');
      textarea.value = JSON.stringify({ ...this.fiddle });
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    },
    deleteFiddle() {
      this.$store.dispatch('deleteFiddle', { key: this.key });
    },
  },
};
</script>


<style>
.settings__items {
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

.settings__item {
  align-items: center;
  display: flex;
  margin: 1rem 0;
}

.settings__label {
  flex-shrink: 0;
}

.settings__input {
  background: #333;
  margin-left: 1rem;
  padding: 1rem;
  width: 100%;
}

.settings__button {
  background-color: #444;
  border-radius: .2rem;
  flex-grow: 1;
  padding: 1rem;
  text-align: center;
}

.settings__button--delete {
  background: #a22;
  margin-left: 1rem;
}
</style>

<template>
  <!-- TODO rename `settings` to settings -->
  <section class="view settings" ng-if="vm.view === 'settings'">
    <div class="settings__items">
      <div class="settings__item">
        <label class="settings__label"> Fiddle name </label>
        <input class="settings__input" v-model="fiddle.name">
      </div>
      <div class="settings__item">
        <button
          class="settings__button"
          @click.prevent="copyToClipboard"
        > Copy to clipboard </button>
        <button
          class="settings__button settings__button--delete"
          @click.prevent="deleteFiddle"
        > Delete </button>
      </div>
    </div>
  </section>
</template>
