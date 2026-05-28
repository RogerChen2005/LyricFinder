<template>
    <div class="container">
        <el-container style="height: 100%;">
            <el-header class="colbox" style="justify-content: space-between;align-items: center;height: 60px;">
                <div style="font-weight: 600;font-size: 25px;"> 歌单</div>
                <el-button style="margin: 20px;" type="primary" @click="get_songlist"><box-icon color="white"
                        name='refresh'></box-icon>刷新歌单</el-button>
            </el-header>
            <el-main v-loading="loading" style="padding:10px;padding-top:0;overflow: auto;height:100px">
                <div id="main">
                    <el-card v-on:click="open(item)" v-for="item in display_list" :key="item.img_url" class="songlist_card"
                        :body-style="{ padding: '10px', textAlign: 'left' }">
                        <img style="width: 100%;border-radius: 5px;" :src="item.img_url">
                        <div style="padding: 5px;overflow: hidden;">
                            <p style="margin:0;padding:0;font-size: 14px;">{{ item.list_name }}</p>
                            <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                        </div>
                    </el-card>
                </div>
            </el-main>
            <el-footer class="footer">
                <el-pagination @current-change="handle_page_change" :default-page-size="30" background
                    layout="prev, pager, next,jumper" :total="total" />
            </el-footer>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useAppStore } from '@/stores'

interface ListItem {
    id: number
    img_url: string
    list_name: string
    count: number
}

const store = useAppStore()
const router = useRouter()

const user_list = ref<ListItem[]>([])
const display_list = ref<ListItem[]>([])
const total = ref(0)
const loading = ref(false)

function get_songlist() {
    loading.value = true
    store.data!.update('private_list', (data) => {
        refresh(data.list as ListItem[])
        ElNotification({ title: 'Success', message: '刷新成功', type: 'success' })
        handle_page_change(1)
        loading.value = false
    }, (err) => {
        console.log(err)
        ElNotification({ title: 'Error', message: '歌单获取失败', type: 'error' })
    })
}

function open(item: ListItem) {
    router.push(`/playlist?id=${item.id}`)
}

function refresh(list: ListItem[]) {
    user_list.value = list
    total.value = list.length
}

function handle_page_change(val: number) {
    display_list.value = user_list.value.slice((val - 1) * 30, val * 30)
}

loading.value = true
store.data!.gets('private_list', (data) => {
    refresh(data.list as ListItem[])
    handle_page_change(1)
    loading.value = false
}, (err) => {
    console.log(err)
    ElNotification({ title: 'Error', message: '歌单获取失败', type: 'error' })
})
</script>

<style scoped>
#main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.footer {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
</style>
