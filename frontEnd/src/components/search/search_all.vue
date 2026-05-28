<template>
    <div id="main_container">
        <div class="section">
            <div class="section-header">
                <div class="section-title">单曲</div>
                <el-link :href="`./#/search/song?key=${key}&page=1`" :underline="false" class="more-link">{{ moreText.song }} ></el-link>
            </div>
            <SongTable :list="songs"></SongTable>
        </div>
        <div class="section">
            <div class="section-header">
                <div class="section-title">专辑</div>
                <el-link :href="`./#/search/album?key=${key}&page=1`" :underline="false" class="more-link">{{ moreText.album }} ></el-link>
            </div>
            <div class="card-grid">
                <el-card v-on:click="display_album(item)" v-for="item in albums" :key="item.id" class="songlist_card"
                    :body-style="{ padding: '0' }" shadow="never">
                    <img class="card-cover" :src="item.cover_img">
                    <div class="card-info">
                        <p class="card-name">{{ item.name }}</p>
                        <p class="card-meta">{{ item.artist }} · {{ item.count }}首</p>
                    </div>
                </el-card>
            </div>
        </div>
        <div class="section">
            <div class="section-header">
                <div class="section-title">歌手</div>
                <el-link :href="`./#/search/artist?key=${key}&page=1`" :underline="false" class="more-link">{{ moreText.artist }} ></el-link>
            </div>
            <div class="card-grid">
                <el-card v-on:click="display_artist(item)" v-for="item in artists" :key="item.id" class="songlist_card"
                    :body-style="{ padding: '0' }" shadow="never">
                    <img class="card-cover artist-img" :src="item.cover_img">
                    <div class="card-info">
                        <p class="card-name">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
        </div>
        <div class="section">
            <div class="section-header">
                <div class="section-title">歌单</div>
                <el-link :href="`./#/search/list?key=${key}&page=1`" :underline="false" class="more-link">{{ moreText.list }} ></el-link>
            </div>
            <div class="card-grid">
                <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                    :body-style="{ padding: '0' }" shadow="never">
                    <img class="card-cover" :src="item.cover_img">
                    <div class="card-info">
                        <p class="card-name">{{ item.name }}</p>
                        <p class="card-meta">{{ item.creator }} · {{ item.count }}首</p>
                    </div>
                </el-card>
            </div>
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
    axios.post('/api/search', { key: key.value }).then((response) => {
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
#main_container {
    height: 100%;
    overflow: auto;
    padding: 24px 36px;
    box-sizing: border-box;
}

.section {
    margin-bottom: 32px;
}

.section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 16px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
}

.more-link {
    font-size: 13px;
    color: var(--text-color-secondary) !important;
}

.more-link:hover {
    color: var(--accent) !important;
}

.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.card-cover {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    display: block;
}

.artist-img {
    border-radius: 50%;
    padding: 16px;
    background: var(--bg-color);
}

.card-info {
    padding: 12px;
}

.card-name {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-meta {
    margin: 4px 0 0;
    font-size: 11px;
    color: var(--text-color-tertiary);
}
</style>
