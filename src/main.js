import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia';


import '../public/main.css';

const app = createApp(App).use(router)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
