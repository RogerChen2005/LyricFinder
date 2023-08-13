import Main from './components/Main.vue'
import ToolsMain from './tools/Tools.vue'
import {createRouter,createWebHashHistory} from 'vue-router'

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Main },
        { path: '/tools/:name', component: ToolsMain },
    ]
})