<template>
    <CDrawer v-model:visible="list_show">
        <template #content>
            <div id="drawer" class="drawer-body" tabindex="-1">
                <div style="height: 80px;">
                    <h2>播放列表</h2>
                </div>
                <el-table :data="playlist" style="width: 100%;">
                    <el-table-column fixed="left" label="" width="30">
                        <template #default="header">
                            <box-icon name='volume-full' v-if="current_playing === header.$index"
                                color='var(--text-color)' size="xs"></box-icon>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" />
                    <el-table-column prop="title" label="名称" />
                    <el-table-column prop="artists" label="歌手">
                        <template #default="scope">
                            <div v-for="i in scope.row.artists" :key="i.id">
                                <el-link @click="display_artist(i)">{{ i.name }}</el-link>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="album" label="专辑">
                        <template #default="scope">
                            <el-link @click="display_album(scope.row.album)">{{ scope.row.album.name }}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                            <div style="display: flex;flex-direction: row;">
                                <el-button link type="danger" size="small" @click="remove(scope.$index)">移除</el-button>
                            </div>
                            <div style="display: flex;flex-direction: row;">
                                <el-button link type="primary" size="small" @click="changeSong(scope.$index)">播放</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </CDrawer>
    <CPage ref="fullscreenEl" v-model:visible="full_screened" :bg="data.album ? `url(${data.album.cover})` : undefined"
        @close="handle_page_close">
        <template #left>
            <img id="full-cover" :src="data.album ? data.album.cover : undefined">
            <div class="full-title" style="text-align: left">
                <div id="full-title">{{ data.title }}</div>
                <div id="full-artist"
                    @click="() => { fullscreenEl?.handleClose(); data.artists && display_artist(data.artists[0]) }">
                    {{ data.artists?.[0]?.name }}
                </div>
            </div>
            <div class="full-slider colbox">
                <div>{{ toTime(current) }}</div>
                <input id="full-input-range" type="range" :value="current" :max="data.duration"
                    @input="(e) => changeLong(Number((e.target as HTMLInputElement).value))" />
                <div>{{ toTime(data.duration) }}</div>
            </div>
            <div class="full-controllers">
                <box-icon name='skip-previous' @click="prev" color='var(--text-color-light)' size='80px'></box-icon>
                <box-icon :name='isPlaying' @click="plays" color='var(--text-color-light)' size='80px'></box-icon>
                <box-icon name='skip-next' @click="next" color='var(--text-color-light)' size='80px'></box-icon>
            </div>
            <div class="full-settings">
                <div style="cursor: pointer;" class="colbox">
                    <box-icon v-if="mode < 2" name='repeat' type='solid' @click="change_mode"
                        color='var(--text-color-light)'></box-icon>
                    <box-icon v-if="mode === 2" name='shuffle' type='solid' @click="change_mode"
                        color='var(--text-color-light)'></box-icon>
                    <div v-if="mode === 1">1</div>
                </div>
                <box-icon name='playlist' type='solid' @click="list_show = true;"
                    style="margin-right: 10px;cursor: pointer;" color='var(--text-color-light)'></box-icon>
            </div>
        </template>
        <template #right>
            <div id="lyrics" ref="lyricsEl">
                <div class="lyric" v-for="l in data.lyric" :key="l.t" @click="() => { play(); changeLong(l.t); }">
                    <div> {{ l.c }}</div>
                    <div class="full-translate-lyric"> {{ l.tc }}</div>
                </div>
            </div>
        </template>
    </CPage>
    <div ref="playerEl" id="player">
        <div id="slider">
            <el-slider size="small" v-model="current" :max="data.duration" :show-tooltip="false"
                @input="changeLong"></el-slider>
        </div>
        <audio :src="data.music_url" @canplay="showLong" ref="audioEl" autoplay @timeupdate="getCurr"
            @pause="is_stop = true" @play="is_stop = false" @ended="ended"></audio>
        <div id="player-ui">
            <div id="left">
                <img @click="open_fullscreen" id="album-cover" :src="data.album ? data.album.cover : undefined">
                <div style="text-align: left;width: 100%;overflow: hidden;">
                    <p class="hide_text" id="title">{{ data.title }}</p>
                    <div class="hide_text" id="artist">
                        <el-link v-if="data.artists" @click="display_artist(data.artists[0])">{{ data.artists[0]?.name
                            }}</el-link>
                    </div>
                </div>
            </div>
            <div id="mid">
                <box-icon name='skip-previous' @click="prev" color='var(--text-color)' size='md'></box-icon>
                <box-icon :name='isPlaying' @click="plays" color='var(--text-color)' size='lg'></box-icon>
                <box-icon name='skip-next' @click="next" color='var(--text-color)' size='md'></box-icon>
            </div>
            <div style="display: flex;flex-direction:row;align-items: center;justify-content: center;">
                <div style="display: flex;letter-spacing: 1px;margin-right: 10px;">
                    <div style="">{{ toTime(current) }}</div>/
                    <div style="">{{ toTime(data.duration) }}</div>
                </div>
                <box-icon name='download' type='solid' color='var(--text-color)' @click="download"
                    style="margin-right: 10px;cursor: pointer;"></box-icon>
                <div style="margin-right:10px;cursor: pointer;" class="colbox">
                    <box-icon v-if="mode < 2" name='repeat' type='solid' color='var(--text-color)'
                        @click="change_mode"></box-icon>
                    <box-icon v-if="mode === 2" name='shuffle' type='solid' color='var(--text-color)'
                        @click="change_mode"></box-icon>
                    <div v-if="mode === 1">1</div>
                </div>
                <box-icon name='playlist' type='solid' color='var(--text-color)' @click="list_show = true;"
                    style="margin-right: 10px;cursor: pointer;"></box-icon>
                <box-icon @click="hide" color='var(--text-color)' style="margin-right: 10px;cursor: pointer;"
                    name='collapse-alt'></box-icon>
            </div>
        </div>
    </div>
    <div ref="showButtonEl" id="show_button" @click="show">
        <box-icon color="#EEEEEE" type='solid' name='music'></box-icon>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores'
import axios from '@/utils/request'
import CDrawer from './UI/CDrawer.vue'
import CPage from './UI/CPage.vue'

interface LyricLine {
    t: number
    c: string
    tc?: string
}

interface Artist {
    id: number
    name: string
}

interface Album {
    id: number
    name: string
    cover: string
}

interface SongData {
    id?: number
    music_url: string
    duration: number
    album_img: string
    title: string
    album?: Album
    artists?: Artist[]
    lyric?: LyricLine[]
}

interface PlaylistItem {
    id: number
    title: string
    artists: Artist[]
    album: Album
}

const router = useRouter()
const store = useAppStore()

const fullscreenEl = ref<InstanceType<typeof CPage>>()
const lyricsEl = ref<HTMLElement>()
const playerEl = ref<HTMLElement>()
const audioEl = ref<HTMLAudioElement>()
const showButtonEl = ref<HTMLElement>()

const data = reactive<SongData>({
    music_url: '',
    duration: 0,
    album_img: '',
    title: '未播放歌曲'
})
const current = ref(100)
const isPlaying = ref('play')
const is_stop = ref(true)
const list_show = ref(false)
const playlist = ref<PlaylistItem[]>([])
const current_playing = ref(0)
const mode = ref(0)
const modes = ['列表循环', '单曲循环', '随机播放']
const full_screened = ref(false)
let currentLyric = 0
let lyricSelector: ReturnType<typeof setInterval> | undefined

function open_fullscreen() {
    if (!data.lyric) {
        axios.post('/api/song/lyric', { id: data.id }).then((res) => {
            data.lyric = []
            if (typeof res.data.lyric === 'string') {
                const arr = res.data.lyric.split('\n')
                for (const ele of arr) {
                    const first_index = ele.indexOf('[')
                    const second_index = ele.indexOf(']')
                    if (first_index !== undefined && second_index) {
                        const time = ele.substring(first_index + 1, second_index)
                        const third_index = time.indexOf(':')
                        const t = Number(time.substring(0, third_index)) * 60 + Number(time.substring(third_index + 1))
                        data.lyric!.push({ t, c: ele.substring(second_index + 1) })
                    } else {
                        data.lyric!.push({ t: 0, c: ele })
                    }
                }
                if (res.data.tlyric) {
                    const arr_t = res.data.tlyric.split('\n')
                    let index = 0
                    for (const ele of arr_t) {
                        const first_index = ele.indexOf('[')
                        const second_index = ele.indexOf(']')
                        if (first_index !== undefined && second_index) {
                            const time = ele.substring(first_index + 1, second_index)
                            const third_index = time.indexOf(':')
                            const t = Number(time.substring(0, third_index)) * 60 + Number(time.substring(third_index + 1))
                            while (index < data.lyric!.length - 1 && data.lyric![index + 1].t <= t) index++
                            data.lyric![index].tc = ele.substring(second_index + 1)
                        }
                    }
                }
            }
            render_lyric()
        })
    } else {
        render_lyric()
    }
}

function render_lyric() {
    full_screened.value = true
    currentLyric = 0
    setTimeout(() => lyricsEl.value?.children[currentLyric]?.classList.add('current-lyric'), 0)
    lyricSelector = setInterval(() => {
        if (isPlaying.value === 'pause' && audioEl.value && data.lyric) {
            const ct = parseInt(String(audioEl.value.currentTime))
            const cl = currentLyric
            let next = cl
            while (data.lyric[next] && ct > data.lyric[next].t) next++
            if (next > cl + 1) {
                lyricsEl.value?.children[cl]?.classList.remove('current-lyric')
                lyricsEl.value?.children[next - 1]?.classList.add('current-lyric')
                lyricsEl.value?.scrollTo({
                    top: (lyricsEl.value?.children[next - 1] as HTMLElement)?.offsetTop - 200,
                    behavior: 'smooth'
                })
                currentLyric = next - 1
            }
        }
    }, 100)
}

function handle_page_close() {
    if (lyricSelector) {
        clearInterval(lyricSelector)
    }
}

function toTime(sec: number): string {
    const s = sec % 60 < 10 ? '0' + sec % 60 : sec % 60
    const min = Math.floor(sec / 60) < 10 ? '0' + Math.floor(sec / 60) : Math.floor(sec / 60)
    return min + ':' + s
}

function getCurr() {
    if (audioEl.value) current.value = parseInt(String(audioEl.value.currentTime))
}

function showLong() {
    if (audioEl.value) data.duration = parseInt(String(audioEl.value.duration))
}

function changeLong(ct: number) {
    if (audioEl.value) audioEl.value.currentTime = ct
}

function plays() {
    if (isPlaying.value === 'play') {
        audioEl.value?.play()
        isPlaying.value = 'pause'
    } else {
        audioEl.value?.pause()
        isPlaying.value = 'play'
    }
}

function find_index(id: number): number {
    for (const index in playlist.value) {
        if (playlist.value[index].id === id) return Number(index)
    }
    return -1
}

function init(songData: PlaylistItem) {
    if (songData.id) {
        const index = find_index(songData.id)
        if (index === -1) {
            playlist.value.push(songData)
            changeSong(playlist.value.length - 1)
        } else {
            changeSong(index)
        }
    }
}

function nextPlay(songData: PlaylistItem) {
    if (songData.id) {
        const index = find_index(songData.id)
        if (index === -1) {
            playlist.value.splice(current_playing.value + 1, 0, songData)
            ElMessage('已添加至播放列表')
        } else if (index !== current_playing.value) {
            const song = playlist.value.splice(index, 1)
            if (index < current_playing.value) current_playing.value -= 1
            playlist.value.splice(current_playing.value + 1, 0, song[0])
        }
    }
}

function changeSong(index: number) {
    isPlaying.value = 'pause'
    let quality = 'exhigh'
    const settings = store.settings
    if (settings && settings.quality) quality = settings.quality
    axios.post('/api/song/url', {
        id: playlist.value[index].id,
        level: quality
    }).then((result) => {
        Object.assign(data, playlist.value[index])
        data.music_url = result.data.url
        current_playing.value = index
        setTimeout(() => apply_media_session(data), 0)
        if (full_screened.value) open_fullscreen()
        show()
    })
}

function remove(index: number) {
    playlist.value.splice(index, 1)
    if (index === current_playing.value) {
        if (playlist.value.length === 0) {
            Object.assign(data, { music_url: '', duration: 0, album_img: '' })
        } else {
            changeSong(index)
        }
    } else if (index < current_playing.value) {
        current_playing.value -= 1
    }
}

function ended() {
    switch (mode.value) {
        default:
            changeSong((current_playing.value + 1) % playlist.value.length)
            break
        case 1:
            changeSong(current_playing.value)
            break
        case 2: {
            const rand = parseInt(String(Math.random() * (playlist.value.length - 1) + 1))
            changeSong((current_playing.value + rand) % playlist.value.length)
            break
        }
    }
}

function next() {
    if (mode.value === 2) {
        const rand = parseInt(String(Math.random() * (playlist.value.length - 1) + 1))
        changeSong((current_playing.value + rand) % playlist.value.length)
    } else {
        changeSong((current_playing.value + 1) % playlist.value.length)
    }
}

function prev() {
    if (mode.value === 2) {
        const rand = parseInt(String(Math.random() * (playlist.value.length - 1) + 1))
        changeSong((current_playing.value + rand) % playlist.value.length)
    } else {
        const n = current_playing.value - 1
        const m = playlist.value.length
        changeSong(((n % m) + m) % m)
    }
}

function show() {
    if (playerEl.value) {
        playerEl.value.style.display = 'block'
        setTimeout(() => {
            if (playerEl.value) playerEl.value.style.transform = 'translate(-50%,0)'
            if (showButtonEl.value) showButtonEl.value.style.transform = 'translateX(10vw)'
        }, 0)
    }
}

function hide() {
    if (playerEl.value) {
        playerEl.value.style.transform = 'translate(-50%,30vh)'
        if (showButtonEl.value) showButtonEl.value.style.transform = 'translateX(0)'
        setTimeout(() => {
            if (playerEl.value) playerEl.value.style.display = 'none'
        }, 500)
    }
}

function change_mode() {
    mode.value = (mode.value + 1) % 3
    ElMessage({ type: 'info', message: modes[mode.value] })
}

function listen_all(queue: PlaylistItem[]) {
    playlist.value = queue
    changeSong(0)
}

function display_album(item: { id: number }) {
    list_show.value = false
    router.push(`./album?id=${item.id}`)
}

function display_artist(item: { id: number }) {
    list_show.value = false
    router.push(`./artist?id=${item.id}`)
}

function play() {
    isPlaying.value = 'pause'
    audioEl.value?.play()
}

function pause() {
    isPlaying.value = 'play'
    audioEl.value?.pause()
}

function apply_media_session(songData: SongData) {
    if ('mediaSession' in navigator && songData.artists && songData.album) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songData.title,
            artist: songData.artists[0].name,
            album: songData.album.name,
            artwork: [
                { src: songData.album.cover, type: 'image/jpeg', sizes: '1024x1024' }
            ]
        })
        const actionHandlers: [MediaSessionAction, (() => void) | null][] = [
            ['play', play],
            ['pause', pause],
            ['previoustrack', prev],
            ['nexttrack', next]
        ]
        for (const [action, handler] of actionHandlers) {
            try {
                navigator.mediaSession.setActionHandler(action, handler)
            } catch (error) {
                console.log(`The media session action "${action}" is not supported yet.`)
            }
        }
    }
}

function download() {
    store.queue?.add(playlist.value[current_playing.value])
}

// Expose player API to store
;(store as unknown as Record<string, Record<string, Function>>).player = {
    listen: (d: PlaylistItem) => init(d),
    listen_all: (d: PlaylistItem[]) => listen_all(d),
    next: (d: PlaylistItem) => nextPlay(d)
}
</script>

<style scoped>
#full-input-range {
    margin: 5px;
    width: calc(100% - 10px);
    opacity: 0.3;
    transition: .3s;
}

#full-input-range::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    border: solid 1px var(--bd-color);
    border-radius: 3px;
    background-color: transparent;
    opacity: 0.8;
}

#full-input-range:hover {
    filter: brightness(110%);
}

#full-input-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    opacity: 0;
}

.full-controllers {
    display: flex;
    justify-content: space-between;
}

#full-cover {
    margin: 5px;
    border-radius: 10px;
    width: calc(100% - 10px);
}

#full-title {
    font-size: 35px;
    font-weight: 700;
}

#full-artist {
    font-size: 20px;
    font-weight: 400;
    cursor: pointer;
}

#full-artist:hover {
    text-decoration: underline;
}

.full-settings {
    display: flex;
    justify-content: space-around;
}

.full-slider {
    color: #d0d0d0;
    transform: translate(0, 10px);
}

#lyrics {
    width: 100%;
    height: 100%;
    overflow: auto;
}

#lyrics::-webkit-scrollbar {
    display: none;
}

.lyric {
    width: fit-content;
    border-radius: 5px;
    font-weight: 200;
    font-size: 40px;
    margin-bottom: 25px;
    filter: blur(3px);
    transition: .3s;
    transform: scale(0.8) translate(-10%, 0);
    padding: 10px;
    cursor: default;
}

.lyric:hover {
    background-color: #ffffff19;
}

.current-lyric {
    filter: none;
    transform: scale(1);
    font-weight: 700;
}

.full-translate-lyric{
    font-size: 30px;
    margin-top: 5px;
}

#player {
    width: 60%;
    height: 80px;
    position: absolute;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.724);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 30vh);
    transition: .7s cubic-bezier(0.52, 0.02, 0.48, 1);
    z-index: 2000;
    display: none;
}

html.dark #player {
    background-color: rgba(34, 34, 34, 0.724);
}

#player #player_icon {
    margin-top: 3px;
    font-size: 55px;
    color: rgb(255, 255, 255);
    width: 60px;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
}

#player-ui {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

#player-ui #album-cover {
    height: 55px;
    width: 55px;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
    transition: .5s;
}

#player-ui #album-cover:hover {
    filter: blur(2px) brightness(80%);
}

#player-ui audio {
    width: 90%;
    height: 50px;
    margin-bottom: 10px;
}

#player-ui #title {
    font-size: 18px;
    margin: 0;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#player-ui #album {
    font-size: 14px;
    margin: 8px;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#player-ui #artist {
    font-size: 10px;
    margin: 0;
    margin-left: 10px;
    font-weight: 300;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#player-ui #left {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 23%;
    max-width: 25%;
}

#player-ui #mid {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: center;
}

#player-ui #mid>* {
    cursor: pointer;
}

#slider {
    position: absolute;
    top: 0;
    width: 100%;
    transform: translateY(-9px);
}

.drawer-body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}

#show_button {
    width: 40px;
    height: 40px;
    position: absolute;
    background-color: #409EFF;
    bottom: 15%;
    right: 3%;
    display: flex;
    border-radius: 100%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 1s;
    z-index: 2001;
}
</style>
