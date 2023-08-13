import { createApp } from 'vue'
import {createRouter,createWebHistory} from 'vue-router'
import App from './App.vue'
import Container from './Container.vue'
import ToolsMain from './tools/Tools.vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn.js'
import 'element-plus/dist/index.css'
import 'boxicons'


const routes = [
    { path: '/', component: App },
    { path: '/tools/:name', component: ToolsMain},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(Container);
app.use(router);
app.use(ElementPlus, { locale })
app.mount('#app')
