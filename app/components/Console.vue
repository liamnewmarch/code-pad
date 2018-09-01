<script>
export default {
  data() {
    return {
      active: false,
    };
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
    }
  },
  props: ['logging', 'project'],
};
</script>

<style>
  .console {
    bottom: 0;
    left: 0;
    max-height: 6rem;
    position: fixed;
    right: 0;
  }

  .console__button {
    bottom: .5rem;
    padding: .5rem;
    position: fixed;
    right: .5rem;
  }

  .console__output {
    background-color: #272822;
    border-top: 1px solid #fff;
    padding: .5rem 3rem .5rem .5rem;
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

  .console__line {
    margin: .5rem 0;
  }

  .console__line::before {
    content: '» ';
    opacity: .5;
  }
</style>

<template>
  <div class="console">
    
    <transition name="console__output-">
      <div class="console__output" v-if="active">
        <div class="console__line" v-for="(line, index) of logging" :key="index">
          {{ format(line) }}
        </div>
        <div class="console__line" v-if="!logging.length"> All good, buddy! </div>
      </div>
    </transition>
    <div class="console__button" @click="toggle">{{ active ? '×' : '$_' }}</div>
  </div>
</template>
