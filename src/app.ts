import { createApp } from "vue"
import { createPinia } from "pinia"

import router from "./router/index.js"
import CodePad from "./components/CodePad.vue"

createApp(CodePad).use(createPinia()).use(router).mount("code-pad")
