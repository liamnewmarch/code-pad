<script>
export default {
  data() {
    return {
      active: false,
    };
  },
  computed: {
    toggleLabel() {
      if (this.active) return '×';
      if (!this.logging.length) return '✔';
      return '»' + this.logging.length;
    },
  },
  methods: {
    format(...data) {
      return data.map(item => {
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
            return 'undefined'
          default:
            return `${type} {}`;
        }
      }).join(', ');
    },
    toggle() {
      this.active = !this.active;
    },
    type(thing) {
      const toString = Object.prototype.toString.call(thing);
      return toString.replace(/\[\w+ (\w+)\]/, '$1');
    },
  },
  props: ['logging', 'project'],
};
</script>

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

<template>
  <div class="console">
    <transition name="console__output-">
      <div class="console__output" v-if="active" ref="output">
        <div class="console__line" v-for="(line, index) of logging" :key="index">
          {{ format(line) }}
        </div>
      </div>
    </transition>
    <button class="console__button" @click="toggle">{{ toggleLabel }}</button>
  </div>
</template>
