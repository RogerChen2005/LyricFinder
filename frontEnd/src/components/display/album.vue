<template>
    <el-container class="container">
        <el-main v-loading="loading" style="padding: 28px 36px; overflow: auto;">
            <div class="detail-header">
                <img class="detail-cover" :src="detail.cover_img" />
                <div class="detail-meta">
                    <div class="detail-type">专辑</div>
                    <div class="detail-name">{{ detail.name }}</div>
                    <div class="detail-count">共 {{ detail.count }} 首</div>
                    <el-button @click="listen_all" type="primary" style="margin-top: 16px;">
                        <box-icon name='add-to-queue' color="#fff" style="margin-right: 6px;"></box-icon>播放全部
                    </el-button>
                </div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="歌曲" name="song">
                    <SongTable :list="list"></SongTable>
                </el-tab-pane>
                <el-tab-pane label="简介" name="description">
                    <div class="description-text">{{ detail.description }}</div>
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
    axios.post('/api/album', { id: id.value }).then((res) => {
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

.detail-count {
    font-size: 13px;
    color: var(--text-color-tertiary);
    margin-top: 8px;
}

.description-text {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-color-secondary);
    max-width: 600px;
}
</style>
