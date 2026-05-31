import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'boxicons'
import router from './router'
import App from './App.vue'
import { syncSystemTheme } from './services/theme.service.ts'

declare const __loader: { set(pct: number): void; done(): void }

const app = createApp(App)
__loader.set(20)

app.use(createPinia())
app.use(router)
__loader.set(50)

app.use(ElementPlus)
__loader.set(80)

syncSystemTheme()

try {
  app.mount('#app')
} finally {
  __loader.done()
}
