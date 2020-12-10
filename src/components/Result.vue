<script>
import Console from './Console.vue';

export default {
  components: {
    Console,
  },
  props: {
    project: {
      default: null,
      type: Object,
    },
  },
  data() {
    return {
      consoleMethods: ['error', 'log', 'warn'],
      logging: [],
    };
  },
  mounted() {
    const { css, html, javascript } = this.project;
    const { contentWindow, contentDocument } = this.$refs.result;
    this.injectHTML(contentDocument, html);
    this.injectCSS(contentDocument, css);
    this.injectJS(contentWindow, javascript);
  },
  methods: {
    injectCSS(targetDocument, css = '') {
      const style = targetDocument.createElement('style');
      style.textContent = css;
      targetDocument.head.appendChild(style);
    },
    injectHTML(targetDocument, html = '') {
      targetDocument.body.innerHTML = html;
    },
    async injectJS(targetWindow, javascript = '') {
      try {
        for (const key of this.$data.consoleMethods) {
          targetWindow.console[key] = (...args) => this.logging.push(...args);
        }
        const url = JSON.stringify('data:text/javascript;base64,' + btoa(javascript));
        await targetWindow.eval(`import('${url}');`);
      } catch (error) {
        this.logging.push('message' in error ? error.message : error);
      }
    },
  },
};
</script>

<template>
  <div class="project__pane">
    <iframe
      ref="result"
      class="project__result"
    />
    <Console
      :logging="logging"
      :project="project"
    />
  </div>
</template>
