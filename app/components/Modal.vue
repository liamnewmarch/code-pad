<script lang="ts">
export default {
  data() {
    return {
      resolve: null,
      visible: false,
    };
  },
  props: {
    buttons: {},
    text: String,
  },
  methods: {
    respond(value) {
      this.visible = false;
      this.resolve(value);
    },
    show() {
      this.visible = true;
      return new Promise(resolve => this.resolve = resolve);
    },
  },
};
</script>

<style>
.modal {
  background-color: #0004;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
}

.modal__popup {
  background-color: #272822;
  /* border: .1rem solid #fff; */
  border-radius: .2rem;
  box-shadow: 0 .1rem 2rem #0008;
  color: #fff;
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem;
  z-index: 10000;
}

.modal__popup--centered {
  bottom: 0;
  left: 0;
  margin: auto;
  max-height: 14rem;
  max-width: 20rem;
  position: fixed;
  right: 0;
  top: 0;
}

.modal__body {
  flex: 1 0 auto;
}

.modal__buttons {
  display: flex;
  justify-content: flex-end;
}

.modal__button {
  background-color: #444;
  border-radius: .2rem;
  padding: 1rem;
}

.modal__button:not(:last-child) {
  margin-right: 1rem;
}

.modal__button--danger {
  background: #a22;
}
</style>

<template>
  <div v-if="visible" ref="modal" class="modal">
    <div class="modal__popup modal__popup--centered">
      <div class="modal__body">
        <p>{{ text }}</p>
      </div>
      <div class="modal__buttons">
        <button
          v-for="(button, index) of buttons" :key="index"
          @click="respond(button.value)"
          class="modal__button"
          :class="{ 'modal__button--danger': button.danger }">
          {{ button.label }}
        </button>
      </div>
    </div>
  </div>
</template>
