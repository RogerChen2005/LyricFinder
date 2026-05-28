<template>
    <el-container class="container">
        <el-main v-loading="loading">
            <div class="colbox" id="container">
                <img id="cover" :src="songlist.cover_img" />
                <div class="rowbox" style="justify-content: space-between;">
                    <div id="name">{{ songlist.name }}</div>
                    <div id="description">{{ songlist.description }}</div>
                    <div id="count">共 {{ songlist.count }} 首 {{ (new Date(songlist.create_time)).toDateString() }}</div>
                    <el-button @click="listen_all" type="primary" style="width: 200px;"><box-icon color="white"
                            name='add-to-queue'></box-icon>播放整页</el-button>
                </div>
            </div>
            <SongTable :list="list"></SongTable>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_drawer_page_change" :default-page-size="30" background
                layout="prev, pager, next,jumper" :total="songlist.count" />
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import axios from '@/utils/request'
import SongTable from './SongTable.vue'

const store = useAppStore()
const route = useRoute()

const id = ref(0)
const index_start = ref(0)
const list = ref<any[]>([])
const loading = ref(true)
const songlist = ref<any>({})

function handle_drawer_page_change(index: number) {
    loading.value = true
    axios.post('/api/playlist/song', {
        id: id.value,
        offset: (index - 1) * 30,
        cookie: localStorage.getItem('cookie')
    }).then((res) => {
        index_start.value = index * 30
        list.value = res.data.songs
        loading.value = false
    })
}

function listen_all() {
    ;(store as unknown as Record<string, Record<string, Function>>).player?.listen_all(list.value)
}

function init() {
    axios.post('/api/playlist/detail', {
        id: id.value,
        cookie: localStorage.getItem('cookie')
    }).then((res) => {
        songlist.value = res.data
        handle_drawer_page_change(1)
    })
}

id.value = Number(route.query.id)
if (id.value) init()
</script>

<style scoped>
#container {
    margin: 20px;
    margin-left: 0;
}

#cover {
    width: 180px;
    height: 180px;
    margin-right: 20px;
    border-radius: 10px;
}

#description {
    font-size: 18px;
    font-weight: 500;
}

#name {
    font-size: 40px;
    font-weight: 800;
}
</style>
