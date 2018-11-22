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
    /* eslint-disable-next-line no-restricted-syntax, guard-for-in */
    for (const key in contentWindow.console) {
      contentWindow.console[key] = (...args) => this.logging.push(...args);
    }
    try {
      contentWindow.eval(javascript);
    } catch (error) {
      this.logging.push('message' in error ? error.message : error);
    }
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
