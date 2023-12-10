import { createApp } from 'vue'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'boxicons'
import router from './router.js'
import App from './App.vue'
// import locale from 'element-plus/lib/locale/lang/zh-cn.js
import classManager from './js/classManager.js'

const app = createApp(App);
const store = createStore({
    state(){
        return{
            classManager:new classManager()
        }
    }
});
app.use(store);
app.use(router);
app.use(ElementPlus)
app.mount('#app')
