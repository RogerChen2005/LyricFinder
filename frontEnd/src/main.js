import { createApp } from 'vue'
import router from './router.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn.js'
import 'element-plus/dist/index.css'
import 'boxicons'

const app = createApp(App);
app.use(router);
app.use(ElementPlus, { locale })
app.mount('#app')
