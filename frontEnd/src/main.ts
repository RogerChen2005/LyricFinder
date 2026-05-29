import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'boxicons'
import router from './router'
import App from './App.vue'
import { syncSystemTheme } from './services/theme.service.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

syncSystemTheme()

app.mount('#app')
