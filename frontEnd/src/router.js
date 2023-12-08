import Main from './components/Main.vue'
import ToolsMain from './tools/Tools.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const tools = () => import('./components/ToolsPage.vue');
const home = () => import('./components/HomePage.vue');
const list = () => import('./components/SongList.vue');
const search = () => import('./components/SearchPage.vue');
const user = () => import('./components/UserPage.vue');
const download = () => import('./components/DownloadPage.vue');
const login = () => import('./components/UserLogin.vue');

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/', component: Main, children: [
                { path: 'tools', component: tools },
                { path: '/', component: home },
                { path: 'list', component: list },
                { path: 'search', component: search },
                { path: 'user', component: user },
                { path: 'download', component: download }
            ]
        },
        { path: '/tools/:name', component: ToolsMain },
        { path: '/login', component: login },
    ]
})