<script>
import Vue from 'vue';

export default {
  props: {
    logging: {
      default: () => [],
      type: Array,
    },
    project: {
      default: () => null,
      type: Object,
    },
  },
  data() {
    return { active: false };
  },
  computed: {
    toggleLabel() {
      if (this.active) return '×';
      if (!this.logging.length) return '$_';
      return `$${this.logging.length}`;
    },
  },
  methods: {
    format(...data) {
      return data.map((item) => {
        const type = this.type(item);
        switch (type) {
          case 'Array':
          case 'Boolean':
          case 'Number':
          case 'Object':
          case 'String':
            return JSON.stringify(item);
          case 'Class':
          case 'Function':
            return item.toString();
          case 'Undefined':
            return 'undefined';
          default:
            return `${type} {}`;
        }
      }).join(', ');
    },
    scrollToBottom() {
      this.$refs.output.scrollTop = this.$refs.output.scrollHeight;
    },
    toggle() {
      this.active = !this.active;
      if (this.active) Vue.nextTick(this.scrollToBottom);
    },
    type(thing) {
      const toString = Object.prototype.toString.call(thing);
      return toString.replace(/\[\w+ (\w+)\]/, '$1');
    },
  },
};
</script>

<template>
  <div class="console">
    <Transition name="console__output-">
      <div
        v-if="active"
        ref="output"
        class="console__output"
      >
        <div
          v-for="(line, index) of logging"
          :key="index"
          class="console__line"
        >
          {{ format(line) }}
        </div>
      </div>
    </Transition>
    <button
      class="console__button"
      @click="toggle"
    >
      {{ toggleLabel }}
    </button>
  </div>
</template>


<style>
  .console {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
  }

  .console__button {
    bottom: 0;
    margin: 1rem;
    padding: 1rem;
    position: fixed;
    right: 0;
  }

  .console__line {
    margin: 1rem 0;
  }

  .console__line::before {
    content: '» ';
    opacity: .5;
  }

  .console__output {
    background-color: #272822;
    border-top: 1px solid #fff;
    height: 8rem;
    overflow: auto;
    padding: 1rem 3rem 1rem 1rem;
  }

  .console__output--enter-active,
  .console__output--leave-active {
    transition: transform .1s ease-in-out;
  }

  .console__output--enter,
  .console__output--leave-to {
    transform: translateY(100%);

  }

  .console__output--enter-to,
  .console__output--leave {
    transition: translateY(0);
  }
</style>
