<template>
    <el-container class="container">
        <el-main v-loading="loading" class="colbox" style="flex-wrap: wrap;width: 100%;">
            <el-card v-on:click="display_artist(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                </div>
            </el-card>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_page_change" :current-page="page" :default-page-size="30" background
                layout="prev, pager, next,jumper" :total="count" />
            <el-text>总共{{count}}个搜索结果</el-text>
        </el-footer>
    </el-container>
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
    axios.post('/api/search/artist', {
        key: key.value,
        offset: (index - 1) * 30
    }).then((response) => {
        lists.value = response.data.artists
        count.value = response.data.count
        loading.value = false
    })
}

function handle_page_change(val: number) {
    router.push(`/search/list?key=${key.value}&page=${val}`)
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
.footer {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>
