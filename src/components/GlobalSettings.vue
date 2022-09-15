<script>
import ModalDialog from './ModalDialog.vue';
import getUnmigratedProjects from '../config/migrate/index.js';

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
      modalText: '',
      version: 'VERSION',
    };
  },
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.uid);
    },
    year() {
      try {
        return new Intl.DateTimeFormat('en', { year: 'numeric' }).format();
      } catch {
        return new Date().getFullYear();
      }
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
    async migrate() {
      const { count, migrate } = getUnmigratedProjects();
      if (count) {
        this.modalText = `Found ${count} project(s). Migrate?`;
        if (await this.$refs.confirm.show()) {
          migrate();
        }
        this.showModal(`Success! Imported ${count} project(s).`);
      } else {
        this.showModal('No projects found to migrate.');
      }
    },
    async signOut() {
      await this.$store.dispatch('signOut');
    },
    async showModal(text) {
      this.modalText = text;
      return await this.$refs.modal.show();
    },
  },
};
</script>

<template>
  <section class="global-settings__container">
    <h2> Export all projects </h2>
    <button
      class="global-settings__button"
      @click="exportJSON"
    >
      Export to clipboard
    </button>
    <h2> Import project(s) </h2>
    <button
      class="global-settings__button"
      @click="importJSON"
    >
      Import from clipboard
    </button>
    <h2> Migrate </h2>
    <button
      class="global-settings__button"
      @click="migrate"
    >
      Migrate old data
    </button>
    <h2> Sign out </h2>
    <button
      class="global-settings__button"
      @click="signOut"
    >
      Sign out from Code Pad
    </button>
    <h2>About</h2>
    <p>Code Pad version {{ version }}</p>
    <p>© {{ year }} Liam Newmarch</p>
    <ModalDialog
      ref="modal"
      :buttons="[{ label: 'Dismiss', value: true }]"
      :text="modalText"
    />
    <ModalDialog
      ref="confirm"
      :buttons="[{
        label: 'Migrate',
        value: true,
      }, {
        label: 'Dismiss',
        value: false,
      }]"
      :text="modalText"
    />
  </section>
</template>

<style>
.global-settings__container {
  padding: 1rem;
}

.global-settings__button {
  border: 1px solid #fff4;
  border-radius: .2rem;
  padding: 1rem 2rem;
}
</style>
