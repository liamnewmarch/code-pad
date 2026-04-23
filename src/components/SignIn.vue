<script>
import { useProjectStore } from '../config/store.js';

export default {
  setup() {
    return { store: useProjectStore() };
  },
  methods: {
    signIn() {
      this.store.signIn();
    },
  },
};
</script>

<template>
  <div class="sign-in">
    <button @click="signIn">
      Sign in with Google
    </button>
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
