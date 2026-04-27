<script setup>
import { onMounted, ref } from "vue"
import ProjectConsole from "./ProjectConsole.vue"

const props = defineProps({
  project: {
    default: null,
    type: Object,
  },
})

const logging = ref([])
const srcdoc = ref(null)

const template = ({ css, html, javascript }) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>parent.injectHandlers(this);</${"script"}>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script type="module">${javascript}</${"script"}>
  </body>
</html>
`

function injectHandlers(window) {
  window.addEventListener("error", ({ message }) => {
    logging.value.push([new Error(message)])
  })
  for (const key of ["error", "info", "log", "warn"]) {
    window.console[key] = (...args) => logging.value.push(args)
  }
}

onMounted(() => {
  try {
    // Code Pad listens for errors and certain console methods in the
    // results iframe and relays them to the console component. We could
    // use postMessage to communicate between windows but the structured
    // clone algorithm doesn’t support all data types. The two windows
    // share an origin so we can use a function instead. This isn’t good
    // but it works for now.

    // In order to capture as many errors as possible we want to bind the
    // onerror listener as soon as we can. We can’t do this before the
    // iframe.srcdoc is set because the window will be reset and waiting
    // until after would miss errors relating to the injected JavaScript.

    // Instead we provide a global hook function in the parent window that
    // the iframe can call from its <head>.
    window.injectHandlers = injectHandlers
    // Apply the template which calls the hook.
    srcdoc.value = template(props.project)
  } catch (error) {
    logging.value.push([error])
  }
})
</script>

<template>
  <div class="result">
    <iframe
      class="result__iframe"
      :srcdoc="srcdoc"
    />
    <ProjectConsole
      :logging="logging"
      :project="project"
    />
  </div>
</template>

<style>
.result {
  display: flex;
  flex: 1 0 0;
  flex-flow: column nowrap;
  min-height: 0;
}

.result__iframe {
  background-color: #111;
  border: 0;
  color: #fff;
  flex: 1 0 0;
  min-height: 0;
}
</style>
