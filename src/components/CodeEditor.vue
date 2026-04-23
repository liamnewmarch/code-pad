<script>
import { useProjectStore } from '../config/store.js';
import { createEditor } from '../config/editor.js';

export default {
  beforeRouteUpdate(to, from, next) {
    this.onTypeChange(to.params.type);
    next();
  },
  props: {
    project: {
      default: null,
      type: Object,
    },
  },
  setup() {
    return { store: useProjectStore() };
  },
  computed: {
    type() {
      return this.$route.params.type;
    },
  },
  mounted() {
    this.editor = createEditor(this.$refs.editor, {
      onChange: this.onChange,
      getType: () => this.type,
    });
    this.onTypeChange();
  },
  unmounted() {
    if (this.editor) this.editor.destroy();
  },
  methods: {
    async onChange() {
      await this.store.updateProject({
        key: this.$route.params.key,
        name: this.type,
        value: this.editor.getValue(),
      });
    },
    onTypeChange(type = this.type) {
      this.editor.setLanguage(type);
      this.editor.setValue(this.project[type]);
    },
  },
};
</script>

<template>
  <div class="editor">
    <div
      ref="editor"
      class="editor__cm"
    />
  </div>
</template>

<style>
.editor {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  min-height: 0;
}

.editor__cm {
  display: flex;
  flex: 1 0 0;
  min-height: 0;
  overflow: hidden;
}

.editor__cm .cm-editor {
  background-color: #111;
  flex: 1 0 0;
  font-size: 16px;
  line-height: 1.2;
  overflow: hidden;
}

.editor__cm .cm-scroller {
  flex: 1 0 0;
  overflow: auto;
  padding: 1rem;
}
</style>
