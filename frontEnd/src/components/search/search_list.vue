<template>
    <div id="main_content" class="container" style="padding: 24px 36px; box-sizing: border-box;">
        <div class="card-grid" v-loading="loading">
            <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '0' }" shadow="never">
                <img class="card-cover" :src="item.cover_img">
                <div class="card-info">
                    <p class="card-name">{{ item.name }}</p>
                    <p class="card-meta">{{ item.creator }} · {{ item.count }}首</p>
                </div>
            </el-card>
        </div>
        <div class="footer" style="margin-top: 20px;">
            <el-pagination @current-change="handle_page_change" :current-page="page" :default-page-size="30" background
                layout="prev, pager, next, jumper" :total="count" />
            <div class="result-count">共 {{ count }} 个结果</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/request'

const route = useRoute()
const router = useRouter()

const count = ref(0)
const lists = ref<any[]>([])
const key = ref('')
const page = ref(1)
const loading = ref(false)

function search_query(index: number) {
    loading.value = true
    axios.post('/api/search/list', {
        key: key.value,
        offset: (index - 1) * 30
    }).then((response) => {
        lists.value = response.data.lists
        count.value = response.data.count
        loading.value = false
    })
}

function handle_page_change(val: number) {
    router.push(`/search/list?key=${key.value}&page=${val}`)
}

function display_list(item: { id: number }) {
    router.push(`/playlist?id=${item.id}`)
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

.footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.result-count {
    font-size: 12px;
    color: var(--text-color-tertiary);
}
</style>
