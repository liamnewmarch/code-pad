<script lang="ts">
export default {
  props: {
    buttons: {
      default: () => [],
      type: Array,
    },
    text: {
      default: () => '',
      type: String,
    },
  },
  data() {
    return {
      resolve: null,
      visible: false,
    };
  },
  methods: {
    respond(value) {
      this.$data.visible = false;
      this.$data.resolve(value);
    },
    show() {
      this.$data.visible = true;
      return new Promise((resolve) => {
        this.$data.resolve = resolve;
      });
    },
  },
};
</script>

<template>
  <div
    v-if="visible"
    ref="modal"
    class="modal"
  >
    <div class="modal__popup modal__popup--centered">
      <div class="modal__body">
        <p>{{ text }}</p>
      </div>
      <div class="modal__buttons">
        <button
          v-for="(button, index) of buttons"
          :key="index"
          :class="{ 'modal__button--danger': button.danger }"
          class="modal__button"
          @click="respond(button.value)"
        >
          {{ button.label }}
        </button>
      </div>
    </div>
  </div>
</template>

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
