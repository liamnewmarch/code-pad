<script>
import createEditor from '../config/editor';

export default {
  beforeRouteUpdate(to, from, next) {
    this.onTypeChange(to.params.type);
    next();
  },
  computed: {
    type() {
      return this.$route.params.type;
    },
  },
  methods: {
    onChange(value) {
      this.$store.dispatch('updateProject', {
        key: this.$route.params.key,
        name: this.type,
        value: this.editor.getValue(),
      });
    },
    onTypeChange(type=this.type) {
      this.editor.setOption('mode', type === 'html' ? 'htmlmixed' : type);
      this.editor.setValue(this.project[type]);
    },
  },
  mounted() {
    this.editor = createEditor(this.$refs.editor, {
      onChange: this.onChange,
      onTypeChange: this.onTypeChange,
    });
  },
  props: ['project'],
};
</script>

<style>
.editor .CodeMirror {
  background-color: inherit;
  font-size: inherit;
  line-height: inherit;
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

<template>
  <div class="project__pane">
    <textarea
      class="editor"
      ref="editor"
    ></textarea>
  </div>
</template>
