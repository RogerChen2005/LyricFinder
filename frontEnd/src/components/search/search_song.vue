<template>
    <el-container id="main_content" class="container">
        <el-main>
            <div style="height:20px;margin-bottom: 10px;padding-left: 10px;display: flex;color: #606266;">
                <el-col :span="8">标题</el-col>
                <el-col :span="6">歌手</el-col>
                <el-col :span="6">专辑</el-col>
                <div style="width: 230px;"></div>
            </div><br />
            <div v-loading="search_loading">
                <el-card v-for="i in searchlist" :key="i.id" class="r-card" body-style="padding:10px;display: flex;
                    flex-direction: row;align-items: center;height:50px;" shadow="hover">
                    <el-col class="hide_text" :span="8">
                        <div style="font-size: 20px;">{{ i.title }}</div>
                    </el-col>
                    <el-col class="hide_text" :span="6">
                        <div v-for="j in i.artists" :key="j.id">
                            <el-link style="font-size: 14px;" @click="display_artist(j)">{{ j.name }}</el-link>
                        </div>
                    </el-col>
                    <el-col class="hide_text" :span="4">
                        <el-link style="font-size: 14px;" @click="display_album(i.album)">{{ i.album.name }}</el-link>
                    </el-col>
                    <el-button v-on:click="listen_temporary(i)" style="margin-left: 20px;">播放</el-button>
                    <el-button v-on:click="add(i)" type="primary" style="margin-left: 20px;">下载</el-button>
                </el-card>
            </div>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_page_change" :current-page="page" :default-page-size="30" background
                layout="prev, pager, next,jumper" :total="count" />
            <el-text>总共{{ count }}个搜索结果</el-text>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import axios from '@/utils/request'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const count = ref(0)
const searchlist = ref<any[]>([])
const search_loading = ref(false)
const key = ref('')
const page = ref(1)

async function add(i: any) {
    const result = await axios.post('func', {
        target: 'get_song_detail',
        data: { id: '' + i.id }
    })
    ;(i.album as any).cover = result.data.album.cover
    store.queue?.add(i)
}

function search_query(index: number) {
    search_loading.value = true
    axios.post('func', {
        target: 'search_song',
        data: {
            key: key.value,
            offset: (index - 1) * 30,
            type: 1
        }
    }).then((response) => {
        searchlist.value = response.data.songs
        count.value = response.data.count
        search_loading.value = false
    })
}

async function listen_temporary(i: any) {
    const result = await axios.post('func', {
        target: 'get_song_detail',
        data: { id: '' + i.id }
    })
    ;(i.album as any).cover = result.data.album.cover
    ;(store as unknown as Record<string, Function>).trylisten?.(i)
}

function handle_page_change(val: number) {
    router.push(`/search/song?key=${key.value}&page=${val}`)
}

function display_album(item: { id: number }) {
    router.push(`/album?id=${item.id}`)
}

function display_artist(item: { id: number }) {
    router.push(`/artist?id=${item.id}`)
}

key.value = route.query.key as string
page.value = Number(route.query.page) || 1
if (key.value) search_query(page.value)

watch(() => route.query, () => {
    key.value = route.query.key as string
    page.value = Number(route.query.page) || 1
    if (key.value) search_query(page.value)
})
</script>

<style scoped>
div {
    text-align: left;
    padding: 10px;
}

#main_content {
    height: 100%;
}

.r-card {
    border-radius: 10px;
    padding: 0;
    margin-bottom: 10px;
}
.hide-text{
    overflow: hidden;
}
</style>
