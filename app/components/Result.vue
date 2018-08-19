<script>
export default {
  data() {
    const { key } = this.$route.params;
    return {
      fiddle: this.$store.state.fiddles[key],
    };
  },
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
};
</script>

<template>
  <div class="fiddle__pane">
    <iframe class="fiddle__result" ref="result"></iframe>
  </div>
</template>
