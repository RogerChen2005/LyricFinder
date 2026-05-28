<template>
    <div id="main_container" class="container">
        <div id="title">欢迎使用Lyric Finder</div>
        <div v-loading="loading">
            <div class="title">
                <div>为你推荐的单曲</div>
            </div>
            <SongTable :list="songs"></SongTable>
            <div class="title">
                <div>为你推荐的歌单</div>
            </div>
            <div class="colbox" id="list">
                <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                    :body-style="{ padding: '10px', textAlign: 'left' }">
                    <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                    <div style="padding: 5px;overflow: hidden;">
                        <div style="font-size: 14px;width: 100%;">{{ item.name }}</div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useAppStore } from '@/stores'
import SongTable from './display/SongTable.vue'

const store = useAppStore()
const router = useRouter()

const loading = ref(false)
const songs = ref<any[]>([])
const lists = ref<any[]>([])

function display_list(item: { id: number }) {
    router.push(`./playlist?id=${item.id}`)
}

loading.value = true
store.data!.gets('discover', (data) => {
    lists.value = data.lists as any[]
    songs.value = data.songs as any[]
    loading.value = false
}, (err) => {
    console.log(err)
    ElNotification({ title: 'Error', message: '刷新失败', type: 'error' })
})
</script>

<style scoped>
#title {
    margin-top: 15px;
    font-size: 30px;
    font-weight: 500;
}

.title {
    display: flex;
    flex-direction: row;
    margin: 10px;
    align-items: baseline;
    font-size: 14px;
}

#main_container {
    text-align: left;
    padding-left: 50px;
    font-size: 25px;
    line-height: 30px;
    height: 100%;
    overflow: auto;
}

#list {
    flex-wrap: wrap;
}
</style>
