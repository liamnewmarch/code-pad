<script setup lang="ts">
import { computed, nextTick, ref } from "vue"

const props = withDefaults(defineProps<{
  logging?: unknown[][]
}>(), {
  logging: () => [],
})

const output = ref<HTMLElement>()
const active = ref(false)

const toggleLabel = computed(() => {
  if (active.value) return "×"
  if (!props.logging.length) return "$_"
  return `$${props.logging.length}`
})

interface IterableLike {
  constructor: { name: string }
  length?: number
  [Symbol.iterator](): Iterator<unknown>
}

interface ErrorLike {
  constructor: { name: string }
  message: unknown
}

function isIterableLike(v: unknown): v is IterableLike {
  return v !== null && typeof v === "object" && Symbol.iterator in v
}

function isErrorLike(v: unknown): v is ErrorLike {
  return v !== null && typeof v === "object" && "message" in v
}

function format(line: unknown[]) {
  // Uses typeof/in checks because instanceof fails across iframe Realms.
  return line.map((item) => {
    if (typeof item === "function") return "ƒ " + item.toString()
    // Iterable objects (Array, Uint8Array, etc.)
    if (isIterableLike(item)) {
      const content = [...item].map((v) => JSON.stringify(v)).join(", ")
      return `${item.constructor.name}(${item.length ?? "?"}) [${content}]`
    }
    // Error-like objects
    if (isErrorLike(item)) return `${item.constructor.name}: ${String(item.message)}`
    return JSON.stringify(item)
  }).join(", ")
}

function scrollToBottom() {
  if (output.value) {
    output.value.scrollTop = output.value.scrollHeight
  }
}

function toggle() {
  active.value = !active.value
  if (active.value) nextTick(scrollToBottom)
}
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
      :aria-expanded="active"
      aria-label="Toggle console"
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
    white-space: pre-wrap;
  }

  .console__line::before {
    content: '» ';
    opacity: .5;
  }

  .console__output {
    background-color: #111;
    border-top: 1px solid #fff;
    height: 8rem;
    overflow: auto;
    padding: 1rem 3rem 1rem 1rem;
  }

  .console__output--enter-active,
  .console__output--leave-active {
    transition: transform .1s ease-in-out;
  }

  .console__output--enter-from,
  .console__output--leave-to {
    transform: translateY(100%);
  }

  .console__output--enter-to,
  .console__output--leave-from {
    transform: translateY(0);
  }
</style>
