<template>
    <el-container class="container">
        <el-main v-loading="loading">
            <div class="colbox" id="container">
                <img id="cover" :src="detail.pic" />
                <div class="rowbox" style="justify-content: space-between;">
                    <div id="name">{{ detail.name }}</div>
                    <el-button @click="listen_all" type="primary" style="width: 200px;"><box-icon color="white"
                            name='add-to-queue'></box-icon>播放热门歌曲</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="热门歌曲" name="song">
                    <SongTable :list="list"></SongTable>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="album">
                    <el-container class="container">
                        <el-main class="colbox" style="flex-wrap: wrap;width: 100%;">
                            <el-card v-on:click="display_album(item)" v-for="item in albums" :key="item.id"
                                class="songlist_card" :body-style="{ padding: '10px', textAlign: 'left' }">
                                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                                <div style="padding: 5px;overflow: hidden;">
                                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.artist }}</p>
                                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                                </div>
                            </el-card>
                        </el-main>
                        <el-footer class="footer">
                            <el-pagination @current-change="handle_page_change" v-model:current-page="page"
                                :default-page-size="30" background layout="prev, pager, next,jumper" :total="count" />
                            <el-text>总共{{ count }}个搜索结果</el-text>
                        </el-footer>
                    </el-container>
                </el-tab-pane>
                <el-tab-pane label="简介" name="description">
                    {{ detail.description ? detail.description : "暂无简介" }}
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import axios from '@/utils/request'
import SongTable from './SongTable.vue'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const id = ref(0)
const count = ref(0)
const list = ref<any[]>([])
const loading = ref(true)
const detail = ref<any>({})
const albums = ref<any[]>([])
const activeName = ref('song')
const page = ref(1)

function listen_all() {
    ;(store as unknown as Record<string, Record<string, Function>>).player?.listen_all(list.value)
}

function init() {
    loading.value = true
    detail.value = {}
    axios.post('func', {
        target: 'artist_info',
        data: { id: id.value }
    }).then((res) => {
        detail.value = res.data.info
        list.value = res.data.songs
        handle_page_change(1)
        loading.value = false
    })
}

function handle_page_change(index: number) {
    axios.post('func', {
        target: 'get_artist_album',
        data: {
            id: id.value,
            offset: (index - 1) * 30
        }
    }).then((res) => {
        albums.value = res.data.albums
        count.value = res.data.count
    })
}

function display_album(item: { id: number }) {
    router.push(`./album?id=${item.id}`)
}

function onRouteChange() {
    id.value = Number(route.query.id)
    if (id.value) init()
}

route && onRouteChange()

import { watch } from 'vue'
watch(() => route.query, () => {
    id.value = Number(route.query.id)
    if (id.value) init()
})
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
