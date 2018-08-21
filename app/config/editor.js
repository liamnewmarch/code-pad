import Vue from 'vue';

import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror-one-dark-theme';

import 'codemirror/mode/css/css.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/javascript/javascript.js';

const defaults = {
  inputStyle: 'textarea',
  theme: 'one-dark',
};

export default function(textarea, methods) {
  const editor = CodeMirror.fromTextArea(textarea, defaults);
  Vue.nextTick(() => {
    editor.on('change', () => methods.onChange());
    methods.onTypeChange();
  });
  return {
    getValue: (...args) => editor.getValue(...args),
    setOption: (...args) => editor.setOption(...args),
    setValue: (...args) => Vue.nextTick(() => editor.setValue(...args)),
  };
};
