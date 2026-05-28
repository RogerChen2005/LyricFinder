<template>
    <el-container class="container">
        <el-main v-loading="loading">
            <div class="colbox" id="container">
                <img id="cover" :src="detail.cover_img" />
                <div class="rowbox" style="justify-content: space-between;">
                    <div id="name">{{ detail.name }}</div>
                    <div id="count">共 {{ detail.count }} 首 {{ (new Date(detail.create_time)).toDateString() }}</div>
                    <el-button @click="listen_all" type="primary" style="width: 200px;"><box-icon color="white"
                            name='add-to-queue'></box-icon>播放整页</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="歌曲" name="song">
                    <SongTable :list="list"></SongTable>
                </el-tab-pane>
                <el-tab-pane label="简介" name="description">
                    {{ detail.description }}
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
const list = ref<any[]>([])
const loading = ref(true)
const detail = ref<any>({})
const activeName = ref('song')

function listen_all() {
    ;(store as unknown as any).player && ((store as unknown as Record<string, Record<string, Function>>).player.listen_all(list.value))
}

function init() {
    loading.value = true
    axios.post('func', {
        target: 'get_album',
        data: { id: id.value }
    }).then((res) => {
        detail.value = res.data.detail
        list.value = res.data.songs
        loading.value = false
    })
}

function display_artist(item: { id: number }) {
    router.push(`./artist?id=${item.id}`)
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

#name {
    font-size: 40px;
    font-weight: 800;
}
</style>
