<template>
    <div class="song-table-wrapper">
        <el-table @row-contextmenu="handleRightClick" :data="list" style="width: 100%;"
            :header-cell-style="{ background: 'var(--bg-color)', color: 'var(--text-color-secondary)', fontWeight: '500', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }"
            :row-style="{ cursor: 'pointer' }"
            @row-dblclick="(row: SongItem) => listen(row)">
        <el-table-column type="index" width="50" />
        <el-table-column prop="title" label="名称" min-width="200">
            <template #default="scope">
                <span class="song-title">{{ scope.row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="artists" label="歌手" min-width="120">
            <template #default="scope">
                <div v-for="artist in scope.row.artists" :key="artist.id">
                    <el-link @click="display_artist(artist)" :underline="false" class="artist-link">{{ artist.name }}</el-link>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="album" label="专辑" min-width="120">
            <template #default="scope">
                <el-link @click="display_album(scope.row.album)" :underline="false" class="album-link">{{ scope.row.album.name }}</el-link>
            </template>
        </el-table-column>
        <el-table-column fixed="right" width="60">
            <template #default="scope">
                <div class="play-circle" @click.stop="listen(list[scope.$index])">
                    <box-icon name="play" size="16px" color="var(--accent)"></box-icon>
                </div>
            </template>
        </el-table-column>
    </el-table>
    </div>
    <Teleport to="body">
        <CRMenu ref="menu" v-model:visible="display">
            <template #content>
                <CRMenuCell v-for="option in options" :key="option.name"
                    @click="option.handler(data); display = false;">
                    <template #icon><box-icon size="20px" color="var(--text-color)"
                            :name="option.icon"></box-icon></template>
                    {{ option.name }}
                </CRMenuCell>
            </template>
        </CRMenu>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import axios from '@/utils/request'
import CRMenu from '../UI/CRMenu.vue'
import CRMenuCell from '../UI/CRMenuCell.vue'

interface Artist {
    id: number
    name: string
}

interface Album {
    id: number
    name: string
    cover: string
}

interface SongItem {
    id: number
    title: string
    artists: Artist[]
    album: Album
}

const props = withDefaults(defineProps<{
    list?: SongItem[]
}>(), {
    list: () => []
})

const store = useAppStore()
const router = useRouter()

const display = ref(false)
const menu = ref<InstanceType<typeof CRMenu>>()
const data = ref<SongItem>({} as SongItem)

const options = [
    { name: '播放', icon: 'play', handler: (d: SongItem) => listen(d) },
    { name: '下一首播放', icon: 'list-plus', handler: (d: SongItem) => (store as unknown as Record<string, Record<string, Function>>).player?.next(d) },
    { name: '下载', icon: 'download', handler: (d: SongItem) => store.queue?.add(d) }
]

function open(x: number, y: number, item: SongItem) {
    display.value = true
    data.value = item
    menu.value?.handleOpen(x, y)
}

async function listen(item: SongItem) {
    const result = await axios.post('/api/song/detail', { id: '' + item.id })
    item.album.cover = result.data.album.cover
    ;(store as unknown as Record<string, Record<string, Function>>).player?.listen(item)
}

function display_album(item: { id: number }) {
    router.push(`./album?id=${item.id}`)
}

function display_artist(item: { id: number }) {
    router.push(`./artist?id=${item.id}`)
}

function handleRightClick(row: SongItem, _col: unknown, e: MouseEvent) {
    e.preventDefault()
    open(e.clientX, e.clientY, row)
}
</script>

<style scoped>
.song-table-wrapper {
    border: 1px solid var(--bd-color);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.song-title {
    font-weight: 500;
    color: var(--text-color);
}

.artist-link {
    font-size: 13px;
    color: var(--text-color-secondary) !important;
}

.artist-link:hover {
    color: var(--accent) !important;
}

.album-link {
    font-size: 13px;
    color: var(--text-color-secondary) !important;
}

.album-link:hover {
    color: var(--accent) !important;
}

.play-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transition: all var(--transition-fast);
    cursor: pointer;
    opacity: 0;
}

.play-circle:hover {
    background: var(--accent-subtle);
}

:deep(.el-table__row:hover) .play-circle {
    opacity: 1;
}
</style>
