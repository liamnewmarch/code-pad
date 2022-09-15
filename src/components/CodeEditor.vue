<script>
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
  computed: {
    type() {
      return this.$route.params.type;
    },
  },
  mounted() {
    this.editor = createEditor(this.$refs.editor, {
      onChange: this.onChange,
      onTypeChange: this.onTypeChange,
    });
  },
  methods: {
    async onChange() {
      await this.$store.dispatch('updateProject', {
        key: this.$route.params.key,
        name: this.type,
        value: this.editor.getValue(),
      });
    },
    onTypeChange(type = this.type) {
      this.editor.setOption('mode', type === 'html' ? 'htmlmixed' : type);
      this.editor.setValue(this.project[type]);
    },
  },
};
</script>

<template>
  <div class="editor">
    <textarea
      ref="editor"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </div>
</template>

<style>
.editor {
  display: flex;
  flex-flow: column nowrap;
  flex: 1 0 auto;
}

.editor .CodeMirror {
  background-color: inherit;
  flex: 1 0 auto;
  font-size: 16px;
  line-height: 1.2;
}

.editor .CodeMirror-scroll {
  box-sizing: inherit;
  height: 100%;
  left: 0;
  padding: 1rem;
  position: absolute;
  top: 0;
  width: 100%;
}

.editor .CodeMirror-sizer {
  border-right-width: 1rem;
}
</style>
