import { createApp } from 'vue'
import { createStore } from 'vuex'
import router from './router.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import locale from 'element-plus/lib/locale/lang/zh-cn.js'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import 'boxicons'
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
