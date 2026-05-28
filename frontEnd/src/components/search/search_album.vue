<template>
    <el-container class="container">
        <el-main v-loading="loading" class="colbox" style="flex-wrap: wrap;width: 100%;">
            <el-card v-on:click="display_album(item)" v-for="item in albums" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.artist }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                </div>
            </el-card>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_page_change" v-model:current-page="page" :default-page-size="30" background
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
const albums = ref<any[]>([])
const key = ref('')
const page = ref(1)
const loading = ref(false)

function search_query(index: number) {
    loading.value = true
    axios.post('func', {
        target: 'search_album',
        data: {
            key: key.value,
            offset: (index - 1) * 30
        }
    }).then((response) => {
        albums.value = response.data.albums
        count.value = response.data.count
        loading.value = false
    })
}

function handle_page_change(val: number) {
    router.push(`/search/album?key=${key.value}&page=${val}`)
}

function display_album(item: { id: number }) {
    router.push(`/album?id=${item.id}`)
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
