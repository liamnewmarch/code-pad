<script>
import ModalDialog from './ModalDialog.vue';

export default {
  components: {
    ModalDialog,
  },
  props: {
    project: {
      default: null,
      type: Object,
    },
  },
  data() {
    return {
      modalCopiedButtons: [{
        label: 'Dismiss',
      }],
      modalDeleteButtons: [{
        label: 'Cancel',
        value: false,
      }, {
        danger: true,
        label: 'Delete',
        value: true,
      }],
    };
  },
  methods: {
    async clone() {
      await this.$store.dispatch('addProject', this.project);
    },
    async copyToClipboard() {
      const json = JSON.stringify([{ ...this.project }]);
      await navigator.clipboard.writeText(json);
      this.$refs.modalCopied.show();
    },
    async deleteProject() {
      const value = await this.$refs.modalDelete.show();
      if (!value) return;
      await this.$store.dispatch('deleteProject', { key: this.project.key });
    },
    async updateName(event) {
      await this.$store.dispatch('updateProject', {
        key: this.project.key,
        name: 'name',
        value: event.target.value,
      });
    },
  },
};
</script>

<template>
  <section
    class="view settings"
    ng-if="vm.view === 'settings'"
  >
    <div class="settings__items">
      <div class="settings__item">
        <label class="settings__label">
          Project name
        </label>
        <input
          :value="project.name"
          class="settings__input"
          @input="updateName"
        >
      </div>
      <div class="settings__item">
        <button
          class="settings__button"
          @click.prevent="copyToClipboard"
        >
          Copy to clipboard
        </button>
        <button
          class="settings__button settings__button--delete"
          @click.prevent="deleteProject"
        >
          Delete
        </button>
      </div>
    </div>
    <ModalDialog
      ref="modalCopied"
      :buttons="modalCopiedButtons"
      text="Project copied to clipboard."
    />
    <ModalDialog
      ref="modalDelete"
      :buttons="modalDeleteButtons"
      text="Are you sure you want to delete this project?"
    />
  </section>
</template>


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
  flex: 1 0 auto;
  padding: 1rem;
  text-align: center;
}

.settings__button--delete {
  background: #a22;
  margin-left: 1rem;
}
</style>
