<script setup>
import { useProjectStore } from "../config/store.js"

const store = useProjectStore()
</script>

<template>
  <div class="sign-in">
    <button @click="store.signIn">
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
</style>
