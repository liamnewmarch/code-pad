<script>
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
  },
  props: {
    project: {
      default: null,
      type: Object,
    },
  },
  data() {
    return {
      modalText: '',
    };
  },
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.uid);
    },
  },
  methods: {
    async exportJSON() {
      const projects = (
        Object
            .entries(this.$store.state.projects)
            .map(([, project]) => project)
      );
      const json = JSON.stringify(projects);
      await navigator.clipboard.writeText(json);
      this.showModal('Projects copied to clipboard.');
    },
    async importJSON() {
      try {
        const json = await navigator.clipboard.readText();
        const projects = JSON.parse(json);
        for (const project of projects) {
          await this.$store.dispatch('addProject', project);
        }
        this.showModal(`Success! Imported ${projects.length} project(s).`);
      } catch (error) {
        this.showModal(`There was an error:\n“${error.message}”`);
      }
    },
    async signOut() {
      await this.$store.dispatch('signOut');
    },
    showModal(text) {
      this.modalText = text;
      this.$refs.modal.show();
    },
  },
};
</script>

<template>
  <section>
    <h2> Export all projects </h2>
    <button
      class="global-settings__export-button"
      @click="exportJSON"
    >
      Export to clipboard
    </button>
    <h2> Import project(s) </h2>
    <button
      class="global-settings__import-button"
      @click="importJSON"
    >
      Import from clipboard
    </button>
    <Modal
      ref="modal"
      :buttons="[{ label: 'Dismiss', value: true }]"
      :text="modalText"
    />
    <h2> Sign out </h2>
    <button
      class="global-settings__sign-out"
      @click="signOut"
    >
      Sign out from Code Pad
    </button>
  </section>
</template>


<style>

</style>
