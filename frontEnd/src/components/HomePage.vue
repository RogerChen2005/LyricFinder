<template>
    <div id="main_container" class="container">
        <div id="welcome">
            <div id="title">发现音乐</div>
            <div id="subtitle">为你精选的歌曲与歌单</div>
        </div>
        <div v-loading="loading">
            <div v-for="(section, i) in sections" :key="i" class="section">
                <div class="section-header">
                    <div class="section-title">{{ section.title }}</div>
                </div>
                <SongTable v-if="section.type === 'song'" :list="section.items"></SongTable>
                <div v-if="section.type === 'playlist'" class="card-grid">
                    <el-card v-for="item in section.items" :key="item.id" class="songlist_card"
                        :body-style="{ padding: '0' }" shadow="never"
                        @click="display_list(item)">
                        <img :src="item.cover_img" class="card-cover" />
                        <div class="card-info">
                            <div class="card-name">{{ item.name }}</div>
                        </div>
                    </el-card>
                </div>
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
const sections = ref<{ title: string; type: string; items: any[] }[]>([])

function display_list(item: { id: number }) {
    router.push(`./playlist?id=${item.id}`)
}

loading.value = true
store.data!.gets('discover', (data) => {
    sections.value = data.sections as any[]
    loading.value = false
}, (err) => {
    console.log(err)
    ElNotification({ title: 'Error', message: '刷新失败', type: 'error' })
})
</script>

<style scoped>
#main_container {
    text-align: left;
    padding: 32px 36px;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
}

#welcome {
    margin-bottom: 32px;
}

#title {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text-color);
}

#subtitle {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin-top: 4px;
}

.section {
    margin-bottom: 36px;
}

.section-header {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 16px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
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
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
