<template>
    <el-container class="container">
        <el-main v-loading="loading" style="padding: 28px 36px; overflow: auto;">
            <div class="detail-header">
                <img class="detail-cover artist-cover" :src="detail.pic" />
                <div class="detail-meta">
                    <div class="detail-type">歌手</div>
                    <div class="detail-name">{{ detail.name }}</div>
                    <el-button @click="listen_all" type="primary" style="margin-top: 16px;">
                        <box-icon name='add-to-queue' color="#fff" style="margin-right: 6px;"></box-icon>播放热门歌曲
                    </el-button>
                </div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="热门歌曲" name="song">
                    <SongTable :list="list"></SongTable>
                </el-tab-pane>
                <el-tab-pane label="专辑" name="album">
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
                    <el-footer class="footer" height="50px">
                        <el-pagination @current-change="handle_page_change" v-model:current-page="page"
                            :default-page-size="30" background layout="prev, pager, next, jumper" :total="count" />
                    </el-footer>
                </el-tab-pane>
                <el-tab-pane label="简介" name="description">
                    <div class="description-text">{{ detail.description || '暂无简介' }}</div>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
    axios.post('/api/artist/info', { id: id.value }).then((res) => {
        detail.value = res.data.info
        list.value = res.data.songs
        handle_page_change(1)
        loading.value = false
    })
}

function handle_page_change(index: number) {
    axios.post('/api/artist/album', {
        id: id.value,
        offset: (index - 1) * 30
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

watch(() => route.query, () => {
    id.value = Number(route.query.id)
    if (id.value) init()
})
</script>

<style scoped>
.detail-header {
    display: flex;
    gap: 24px;
    margin-bottom: 28px;
}

.detail-cover {
    width: 200px;
    height: 200px;
    border-radius: var(--radius-lg);
    object-fit: cover;
    box-shadow: var(--shadow-lg);
    flex-shrink: 0;
}

.artist-cover {
    border-radius: 50%;
}

.detail-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.detail-type {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent);
    margin-bottom: 8px;
}

.detail-name {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.5px;
    line-height: 1.2;
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

.description-text {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-color-secondary);
    max-width: 600px;
}
</style>
