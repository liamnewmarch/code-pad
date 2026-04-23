import { createApp } from 'vue';

import { pinia } from './config/store.js';
import router from './config/router.js';
import CodePad from './components/CodePad.vue';

createApp(CodePad).use(pinia).use(router).mount('code-pad');
