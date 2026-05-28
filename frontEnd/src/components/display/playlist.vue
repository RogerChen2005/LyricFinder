<template>
    <el-container class="container">
        <el-main v-loading="loading" style="padding: 28px 36px; overflow: auto;">
            <div class="detail-header">
                <img class="detail-cover" :src="songlist.cover_img" />
                <div class="detail-meta">
                    <div class="detail-type">歌单</div>
                    <div class="detail-name">{{ songlist.name }}</div>
                    <div class="detail-desc">{{ songlist.description }}</div>
                    <div class="detail-count">共 {{ songlist.count }} 首</div>
                    <el-button @click="listen_all" type="primary" style="margin-top: 16px;">
                        <box-icon name='add-to-queue' color="#fff" style="margin-right: 6px;"></box-icon>播放全部
                    </el-button>
                </div>
            </div>
            <SongTable :list="list"></SongTable>
        </el-main>
        <el-footer class="footer" height="50px">
            <el-pagination @current-change="handle_drawer_page_change" :default-page-size="30" background
                layout="prev, pager, next, jumper" :total="songlist.count" />
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

.detail-desc {
    font-size: 13px;
    color: var(--text-color-secondary);
    margin-top: 8px;
    line-height: 1.5;
    max-width: 400px;
}

.detail-count {
    font-size: 13px;
    color: var(--text-color-tertiary);
    margin-top: 8px;
}
</style>
