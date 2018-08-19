<script>
import Vue from 'vue';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror-one-dark-theme';

import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/javascript/javascript.js';

export default {
  beforeRouteUpdate(to, from, next) {
    this.updateEditor(to.params.type);
    next();
  },
  computed: {
    type() {
      return this.$route.params.type;
    },
  },
  methods: {
    updateEditor(type) {
      this.editor.setOption('mode', type === 'html' ? 'htmlmixed' : type);
      Vue.nextTick(() => {
        this.editor.setValue(this.fiddle[type]);
      });
    },
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.editor, {
      theme: 'one-dark',
    });
    this.updateEditor(this.type);
    this.editor.on('change', () => {
      this.$store.dispatch('updateFiddle', {
        key: this.$route.params.key,
        name: this.type,
        value: this.editor.getValue(),
      });
    });
  },
  props: ['fiddle'],
};
</script>

<template>
  <div class="fiddle__pane">
    <textarea
      class="fiddle__editor"
      ref="editor"
    ></textarea>
  </div>
</template>
