<script>
import Console from './Console';

export default {
  components: {
    Console,
  },
  data() {
    return { logging: [] };
  },
  mounted() {
    const { css = '', html = '', javascript = '' } = this.project;
    const { contentWindow, contentDocument } = this.$refs.result;
    // HTML
    contentDocument.body.innerHTML = html;
    // CSS
    const style = contentDocument.createElement('style');
    style.textContent = css;
    contentDocument.head.appendChild(style);
    // JavaScript
    for (const key in contentWindow.console) {
      contentWindow.console[key] = (...args) => this.logging.push(...args);
    }
    try {
      contentWindow.eval(javascript);
    } catch (error) {
      this.logging.push('message' in error ? error.message : error);
    }
  },
  props: ['project'],
};
</script>

<template>
  <div class="project__pane">
    <iframe class="project__result" ref="result"></iframe>
    <Console :logging="logging" :project="project" />
  </div>
</template>
