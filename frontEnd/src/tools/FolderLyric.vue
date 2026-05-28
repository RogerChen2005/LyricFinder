<template>
    <el-container id="main">
        <el-main >
            <div class="header">
                <el-input disabled v-model="path" placeholder="请选择文件夹"></el-input>
                <el-button type="primary" style="margin-left: 10px;" v-on:click="select_folder">选择文件夹</el-button>
            </div>
            <el-table :data="queue" style="width: 100%" v-loading="loading">
                <el-table-column type="index" />
                <el-table-column prop="title" label="名称" />
                <el-table-column prop="artists" label="歌手" />
                <el-table-column prop="album" label="专辑" />
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-progress :percentage="queue[scope.$index].current * 100"
                            style="width: 80%;"></el-progress>
                        <div style="display: flex;flex-direction: row;">
                            <el-button link type="danger" size="small" @click="remove(scope.$index)">移除</el-button>
                        </div>
                        <div style="display: flex;flex-direction: row;">
                            <el-button link type="primary" size="small" @click="edit(scope.$index)">修改</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="footer">
            <el-button type="primary" @click="download">下载</el-button>
        </el-footer>
    </el-container>

    <el-dialog fullscreen v-model="dialog.show" title="选择">
        <el-container id="main_content">
            <el-main>
                <el-table :data="dialog.queue" style="width: 100%" v-loading="dialog.loading">
                    <el-table-column type="index" />
                    <el-table-column prop="title" label="名称" />
                    <el-table-column prop="artists" label="歌手" />
                    <el-table-column prop="album" label="专辑" />
                    <el-table-column fixed="right" label="操作">
                        <template #default="footer">
                            <div style="display: flex;flex-direction: row;">
                                <el-button link type="primary" size="small" @click="choose(footer.$index)">选择</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer class="footer">
                <el-pagination @current-change="handle_page_change" :default-page-size="30" background
                    layout="prev, pager, next,jumper" :total="dialog.count" />
                <el-text>总共{{ dialog.count }}个搜索结果</el-text>
            </el-footer>
        </el-container>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from '@/utils/request'
import { ElMessage } from 'element-plus'

interface QueueItem {
    title: string
    artists: string
    album: string
    search_key: string
    id: number
    current: number
}

const path = ref('')
const queue = ref<QueueItem[]>([])
const loading = ref(false)
const dialog = reactive({
    show: false,
    queue: [] as Record<string, unknown>[],
    key: '',
    index: 0,
    loading: false,
    count: 0
})
const task_remain = ref(0)
let socket: WebSocket | null = null

async function select_folder() {
    path.value = await (window as unknown as { electronAPI: { filePicker: () => Promise<string> } }).electronAPI.filePicker()
    loading.value = true
    const result = await axios.post('/api/folder/songs', { path: path.value })
    queue.value = result.data.queue
    loading.value = false
}

function count_handler(message: MessageEvent) {
    const index = JSON.parse(message.data).message
    queue.value[index].current += 1
    task_remain.value -= 1
    if (task_remain.value === 0) {
        queue.value.splice(0)
        socket?.close()
        ElMessage({ message: '下载完成', type: 'success' })
    }
}

function download() {
    const options = JSON.parse(localStorage.getItem('settings') ?? 'null')
    task_remain.value = queue.value.length
    axios.post('/api/folder/download', {
        queue: queue.value,
        options: {
            classify: false,
            use_origin_name: true,
            path: path.value,
            song: false, cover: false, lyric: true,
            tlyric: options ? options.tlyric : true
        }
    }).then((res) => {
        console.log(res)
        ElMessage({ message: '下载已经开始', type: 'info' })
        socket = new WebSocket('ws://localhost:3000')
        socket.addEventListener('open', function open() {
            console.log('Connected!')
            socket?.removeEventListener('open', open)
        })
        socket.addEventListener('message', count_handler)
    })
    for (const i in queue.value) {
        queue.value[i].current = 0
    }
}

function remove(index: number) {
    queue.value.splice(index, 1)
    ElMessage({ message: '已移除', type: 'success' })
}

function edit(index: number) {
    dialog.show = true
    dialog.key = queue.value[index].search_key
    dialog.index = index
    handle_page_change(1)
}

function search_query(index: number, callback?: (data: Record<string, unknown>) => void) {
    axios.post('/api/search/song', {
        key: dialog.key,
        offset: (index - 1) * 30
    }).then((response) => {
        if (typeof callback === 'function') callback(response.data)
    })
}

function handle_page_change(val: number) {
    search_query(val, (result) => {
        dialog.loading = false
        dialog.queue = result.songs as Record<string, unknown>[]
        dialog.count = result.count as number
    })
}

function choose(index: number) {
    const dest = queue.value[dialog.index]
    const src = dialog.queue[index]
    dest.title = src.title as string
    dest.id = src.id as number
    dest.album = src.album as string
    dest.artists = src.artists as string
    dialog.show = false
}
</script>

<style scoped>
#main {
    padding: 20px;
    overflow: auto;
    height: 100%;
}

.header {
    display: flex;
    flex-direction: row;
}

.footer {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>
