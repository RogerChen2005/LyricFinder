<template>
    <div id="main_container">
        <div class="title">
            <div>单曲</div><el-link :href="`./#/search/song?key=${key}&page=1`">{{ moreText.song }}</el-link>
        </div>
        <SongTable :list="songs"></SongTable>
        <div class="title">
            <div>专辑</div><el-link :href="`./#/search/album?key=${key}&page=1`">{{ moreText.album }}</el-link>
        </div>
        <div class="colbox col-container">
            <el-card v-on:click="display_album(item)" v-for="item in albums" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.artist }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                </div>
            </el-card>
        </div>
        <div class="title">
            <div>歌手</div><el-link :href="`./#/search/artist?key=${key}&page=1`">{{ moreText.artist }}</el-link>
        </div>
        <div class="colbox col-container">
            <el-card v-on:click="display_artist(item)" v-for="item in artists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                </div>
            </el-card>
        </div>
        <div class="title">
            <div>歌单</div><el-link :href="`./#/search/list?key=${key}&page=1`">{{ moreText.list }}</el-link>
        </div>
        <div class="colbox col-container">
            <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.creator }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/request'
import SongTable from '../display/SongTable.vue'

const route = useRoute()
const router = useRouter()

const songs = ref<any[]>([])
const albums = ref<any[]>([])
const lists = ref<any[]>([])
const artists = ref<any[]>([])
const key = ref('')
const moreText = ref<any>({})

function search_query() {
    axios.post('func', {
        target: 'search_all',
        data: { key: key.value }
    }).then((response) => {
        songs.value = response.data.songs
        albums.value = response.data.albums
        lists.value = response.data.lists
        artists.value = response.data.artists
        moreText.value = response.data.moreText
    })
}

function display_album(item: { id: number }) {
    router.push(`/album?id=${item.id}`)
}

function display_list(item: { id: number }) {
    router.push(`/playlist?id=${item.id}`)
}

function display_artist(item: { id: number }) {
    router.push(`/artist?id=${item.id}`)
}

key.value = route.query.key as string
if (key.value) search_query()

watch(() => route.query, () => {
    key.value = route.query.key as string
    if (key.value) search_query()
})
</script>

<style scoped>
@keyframes enter {
    0% {
        transform: translateY(300px);
        opacity: 0;
    }
    100% {
        transform: translateY(0%);
        opacity: 1;
    }
}

.title{
    display: flex;
    flex-direction: row;
    margin: 10px;
    align-items: baseline;
}

.title div{
    font-size: 20px;
    font-weight: 800;
    margin-right: 20px;
}
.col-container{
    flex-wrap: wrap;
    overflow-x: auto;
}

#main_container {
    height: 100%;
    width:calc(100% - 20px);
    overflow:auto;
    margin-left: 20px;
}

.r-card {
    border-radius: 10px;
    padding: 0;
    margin-bottom: 10px;
}

.footer {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>
