<script>
import Console from './Console.vue';

const template = ({ css, consoleMethods, html, javascript }) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>
      ${consoleMethods}.map(k=>console[k]=(...a)=>parent.postMessage(...a));
      onerror=m=>parent.postMessage(m);
    </${'script'}>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script type="module">${javascript}</${'script'}>
  </body>
</html>
`;

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
      consoleMethods: ['error', 'info', 'log', 'warn'],
      logging: [],
      srcdoc: null,
    };
  },
  mounted() {
    try {
      window.onmessage = ({ data }) => this.logging.push(data);
      this.srcdoc = this.renderTemplate();
    } catch (error) {
      this.logging.push(error.message);
    }
  },
  methods: {
    renderTemplate() {
      const { css = '', html = '', javascript = '' } = this.project;
      const consoleMethods = JSON.stringify(this.consoleMethods);
      return template({ css, consoleMethods, html, javascript });
    },
  },
};
</script>

<template>
  <div class="project__pane">
    <iframe
      class="project__result"
      :srcdoc="srcdoc"
    />
    <Console
      :logging="logging"
      :project="project"
    />
  </div>
</template>
