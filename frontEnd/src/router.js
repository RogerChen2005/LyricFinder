import Main from './components/Main.vue'
import search from './components/SearchPage.vue'
import ToolsMain from './tools/Tools.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const tools = () => import('./components/ToolsPage.vue');
const home = () => import('./components/HomePage.vue');
const list = () => import('./components/SongList.vue');
const search_all = () =>import('./components/search/search_all.vue');
const search_song = () =>import('./components/search/search_song.vue');
const search_album = () =>import('./components/search/search_album.vue');
const search_list = () =>import('./components/search/search_list.vue');
const user = () => import('./components/UserPage.vue');
const download = () => import('./components/DownloadPage.vue');
const login = () => import('./components/UserLogin.vue');
const album = () => import('./components/display/album.vue');
const playlist = () => import('./components/display/playlist.vue');

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/', component: Main, children: [
                { path: 'tools', component: tools },
                { path: '/', component: home },
                { path: 'list', component: list },
                { path: 'search', component: search ,children:[
                    {path:'all',component:search_all},
                    {path:'song',component:search_song},
                    {path:'album',component:search_album},
                    {path:'list',component:search_list},
                ]},
                { path: 'user', component: user },
                { path: 'download', component: download },
                { path: 'album',component:album },
                { path: 'playlist',component:playlist },
            ]
        },
        { path: '/tools/:name', component: ToolsMain },
        { path: '/login', component: login },
    ]
})