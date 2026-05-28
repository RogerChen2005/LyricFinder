<template>
    <div id="main_content" class="container" style="padding: 24px 36px; box-sizing: border-box;">
        <div v-loading="search_loading">
            <SongTable :list="searchlist"></SongTable>
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
import { useAppStore } from '@/stores'
import axios from '@/utils/request'
import SongTable from '../display/SongTable.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const count = ref(0)
const searchlist = ref<any[]>([])
const search_loading = ref(false)
const key = ref('')
const page = ref(1)

function search_query(index: number) {
    search_loading.value = true
    axios.post('/api/search/song', {
        key: key.value,
        offset: (index - 1) * 30
    }).then((response) => {
        searchlist.value = response.data.songs
        count.value = response.data.count
        search_loading.value = false
    })
}

function handle_page_change(val: number) {
    router.push(`/search/song?key=${key.value}&page=${val}`)
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
#main_content {
    height: 100%;
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
