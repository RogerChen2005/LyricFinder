<template>
    <el-container id="main">
        <template v-if="!supported">
            <el-main class="unsupported">
                <el-empty description="浏览器不支持 File System Access API，请使用 Chrome 或 Edge" />
            </el-main>
        </template>
        <template v-else>
            <el-main>
                <div class="header">
                    <el-button type="primary" @click="selectFolder">选择文件夹</el-button>
                    <el-text v-if="dirName" style="margin-left: 12px;">{{ dirName }}</el-text>
                    <el-button v-if="matches.length" type="success" style="margin-left: auto;" @click="downloadSelected" :loading="downloading">下载勾选歌词</el-button>
                </div>

                <el-table v-if="matches.length" :data="matches" style="width: 100%; margin-top: 16px;"
                    v-loading="scanning" :header-cell-style="{ background: 'var(--bg-color)', color: 'var(--text-color-secondary)' }">
                    <el-table-column type="index" width="50" />
                    <el-table-column label="本地文件" min-width="180">
                        <template #default="{ row }">
                            <div>{{ row.localTitle }}</div>
                            <div style="font-size: 12px; color: var(--text-color-secondary);">{{ row.localArtists }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="匹配结果" min-width="180">
                        <template #default="{ row }">
                            <template v-if="row.matchedId">
                                <div>{{ row.matchedTitle }}</div>
                                <div style="font-size: 12px; color: var(--text-color-secondary);">{{ row.matchedArtists }}</div>
                            </template>
                            <el-text v-else type="warning">未匹配</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template #default="{ row }">
                            <el-tag v-if="row.status === 'pending'" type="info">等待</el-tag>
                            <el-tag v-else-if="row.status === 'downloading'" type="primary">下载中</el-tag>
                            <el-tag v-else-if="row.status === 'done'" type="success">完成</el-tag>
                            <el-tag v-else-if="row.status === 'error'" type="danger">失败</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="160">
                        <template #default="{ row, $index }">
                            <el-button link type="primary" size="small" @click="editMatch($index)">修改</el-button>
                            <el-button link type="danger" size="small" @click="removeMatch($index)">移除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="50" />
                </el-table>
            </el-main>
        </template>
    </el-container>

    <!-- Search dialog -->
    <el-dialog v-model="dialog.show" title="手动匹配" width="700px" append-to-body class="search-dialog">
        <el-input v-model="dialog.key" placeholder="搜索关键词" @keyup.enter="searchCurrent">
            <template #append>
                <el-button @click="searchCurrent">搜索</el-button>
            </template>
        </el-input>
        <el-table :data="dialog.results" style="width: 100%; margin-top: 12px;" v-loading="dialog.loading">
            <el-table-column type="index" width="50" />
            <el-table-column prop="title" label="名称" />
            <el-table-column label="歌手">
                <template #default="{ row }">
                    {{ formatArtists(row.artists) }}
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑" />
            <el-table-column fixed="right" label="操作" width="80">
                <template #default="{ $index }">
                    <el-button link type="primary" size="small" @click="chooseMatch($index)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="dialog.total > 30" style="margin-top: 12px; justify-content: center;"
            @current-change="searchPage" :page-size="30" background layout="prev, pager, next" :total="dialog.total" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from '@/utils/request'
import { ElMessage } from 'element-plus'
import { parseBlob } from 'music-metadata'

const AUDIO_EXTS = new Set(['.mp3', '.flac', '.wav', '.aac', '.ogg', '.m4a', '.wma', '.opus'])

function formatArtists(artists: any): string {
    if (typeof artists === 'string') return artists
    if (Array.isArray(artists)) return artists.map(a => a.name || a).join(', ')
    return ''
}

interface MatchItem {
    fileName: string
    localTitle: string
    localArtists: string
    localAlbum: string
    matchedId: number | null
    matchedTitle: string
    matchedArtists: string
    matchedAlbum: string
    selected: boolean
    status: 'pending' | 'downloading' | 'done' | 'error'
    fileHandle: FileSystemFileHandle
}

const supported = typeof (window as any).showDirectoryPicker === 'function'

const dirName = ref('')
const matches = ref<MatchItem[]>([])
const scanning = ref(false)
const downloading = ref(false)
let dirHandle: FileSystemDirectoryHandle | null = null

const dialog = reactive({
    show: false,
    key: '',
    index: 0,
    loading: false,
    results: [] as any[],
    total: 0
})

async function selectFolder() {
    try {
        dirHandle = await (window as any).showDirectoryPicker({ mode: 'readwrite' })
    } catch {
        return
    }
    dirName.value = dirHandle!.name
    matches.value = []
    scanning.value = true

    const entries: [string, FileSystemFileHandle][] = []
    for await (const [name, handle] of dirHandle!.entries()) {
        if (handle.kind === 'file') {
            const ext = '.' + name.split('.').pop()!.toLowerCase()
            if (AUDIO_EXTS.has(ext)) {
                entries.push([name, handle])
            }
        }
    }
    console.log(entries)

    for (const [name, handle] of entries) {
        try {
            const file = await handle.getFile()
            const metadata = await parseBlob(file)
            const title = metadata.common.title || name.replace(/\.[^.]+$/, '')
            const artists = metadata.common.artist || ''
            const album = metadata.common.album || ''

            const searchKey = artists ? `${title} ${artists}` : title
            const searchResult = await searchSong(searchKey)

            matches.value.push({
                fileName: name,
                localTitle: title,
                localArtists: artists,
                localAlbum: album,
                matchedId: searchResult?.id ?? null,
                matchedTitle: searchResult?.title ?? '',
                matchedArtists: searchResult?.artists ?? '',
                matchedAlbum: searchResult?.album?.name ?? '',
                selected: !!searchResult,
                status: 'pending',
                fileHandle: handle
            })
        } catch (e) {
            console.warn(`Failed to read metadata: ${name}`, e)
        }
    }
    scanning.value = false
}

async function searchSong(key: string): Promise<any | null> {
    try {
        const res = await axios.post('/api/search/song', { key, offset: 0 })
        const songs = res.data.songs as any[]
        return songs.length > 0 ? songs[0] : null
    } catch {
        return null
    }
}

function editMatch(index: number) {
    const item = matches.value[index]
    dialog.index = index
    dialog.key = item.localArtists ? `${item.localTitle} ${item.localArtists}` : item.localTitle
    dialog.show = true
    searchCurrent()
}

async function searchCurrent() {
    dialog.loading = true
    try {
        const res = await axios.post('/api/search/song', { key: dialog.key, offset: 0 })
        dialog.results = res.data.songs
        dialog.total = res.data.count
    } catch {
        dialog.results = []
    }
    dialog.loading = false
}

async function searchPage(page: number) {
    dialog.loading = true
    try {
        const res = await axios.post('/api/search/song', { key: dialog.key, offset: (page - 1) * 30 })
        dialog.results = res.data.songs
    } catch {
        dialog.results = []
    }
    dialog.loading = false
}

function chooseMatch(index: number) {
    const src = dialog.results[index]
    const dest = matches.value[dialog.index]
    dest.matchedId = src.id
    dest.matchedTitle = src.title
    dest.matchedArtists = typeof src.artists === 'string' ? src.artists : src.artists.map((a: any) => a.name).join(', ')
    dest.matchedAlbum = src.album?.name || ''
    dest.selected = true
    dialog.show = false
}

function removeMatch(index: number) {
    matches.value.splice(index, 1)
}

async function downloadSelected() {
    const selected = matches.value.filter(m => m.selected && m.matchedId && m.status !== 'done')
    if (!selected.length) {
        ElMessage({ message: '请勾选需要下载的歌词', type: 'warning' })
        return
    }

    const options = JSON.parse(localStorage.getItem('settings') ?? 'null') ?? { tlyric: true }
    downloading.value = true

    for (const item of selected) {
        item.status = 'downloading'
        try {
            const query = {
                id: item.matchedId,
                title: item.matchedTitle,
                artists: item.matchedArtists,
                album: item.matchedAlbum
            }
            const dlRes = await axios.post('/api/download/lyric', {
                query,
                options: { tlyric: options.tlyric, use_origin_name: false }
            })
            const filename = dlRes.data.filename

            const fileRes = await axios({
                method: 'post',
                responseType: 'blob',
                data: { filename },
                url: '/api/file'
            })

            const lrcName = item.fileName.replace(/\.[^.]+$/, '.lrc')
            const fileHandle = await dirHandle!.getFileHandle(lrcName, { create: true })
            const writable = await fileHandle.createWritable()
            await writable.write(fileRes.data)
            await writable.close()

            item.status = 'done'
        } catch (e) {
            console.error(`Download failed: ${item.fileName}`, e)
            item.status = 'error'
        }
    }

    downloading.value = false
    ElMessage({ message: '下载完成', type: 'success' })
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
    align-items: center;
}

.footer {
    display: flex;
    align-items: center;
    justify-content: center;
}

.unsupported {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.search-dialog {
    background-color: var(--bg-color);
}
</style>
