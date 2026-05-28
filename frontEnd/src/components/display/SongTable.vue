<template>
    <el-table @row-contextmenu="handleRightClick" :data="list" style="width: 100%;">
        <el-table-column type="index" />
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="artists" label="歌手">
            <template #default="scope">
                <div v-for="artist in scope.row.artists" :key="artist.id">
                    <el-link @click="display_artist(artist)">{{ artist.name }}</el-link>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="album" label="专辑">
            <template #default="scope">
                <el-link @click="display_album(scope.row.album)">{{ scope.row.album.name }}</el-link>
            </template>
        </el-table-column>
        <el-table-column fixed="right">
            <template #default="scope">
                <div class="play-circle" @click="listen(list[scope.$index])">
                    <box-icon name="play-circle" size="20px" color="var(--text-color)"></box-icon>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <Teleport to="body">
        <CRMenu ref="menu" v-model:visible="display">
            <template #content>
                <CRMenuCell v-for="option in options" :key="option.name"
                    @click="option.handler(data); display = false;">
                    <template #icon><box-icon size="25px" color="var(--text-color)"
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
    const result = await axios.post('func', {
        target: 'get_song_detail',
        data: { id: '' + item.id }
    })
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
.play-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    transition: .5s;
    cursor: pointer;
}

.play-circle:hover {
    background-color: var(--bg-color-solid-hover);
}
</style>
