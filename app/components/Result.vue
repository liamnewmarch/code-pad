<script>
export default {
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
    try {
      contentWindow.eval(javascript);
    } catch (error) {
      alert(error);
    }
  },
  props: ['project'],
};
</script>

<template>
  <div class="project__pane">
    <iframe class="project__result" ref="result"></iframe>
  </div>
</template>
