<script>
export default {
  mounted() {
    const { contentWindow, contentDocument } = this.$refs.result;
    // HTML
    contentDocument.body.innerHTML = this.fiddle.html;
    // CSS
    const style = contentDocument.createElement('style');
    style.innerHTML = this.fiddle.css || '';
    contentDocument.head.appendChild(style);
    // JavaScript
    try {
      contentWindow.eval(this.fiddle.javascript || '');
    } catch (error) {
      alert(error);
    }
  },
  props: ['fiddle'],
};
</script>

<template>
  <div class="fiddle__pane">
    <iframe class="fiddle__result" ref="result"></iframe>
  </div>
</template>
