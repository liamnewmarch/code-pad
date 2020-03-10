<script>
export default {
  methods: {
    signIn() {
      this.$store.dispatch('signIn');
    },
  },
};
</script>

<template>
  <div class="sign-in">
    <button @click="signIn">
      Sign in with Google
    </Button>
  </div>
</template>

<style>
.sign-in {
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding: 5rem 0;
  text-align: center;
}

.google-icon {
  margin-left: .5rem;
}
</style>
