<template>
    <!-- <transition name="drawer-show">
        
    </transition> -->
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
                                <el-button link type="primary" size="small" @click="change(scope.$index)">播放</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </template>
    </CDrawer>
    <CPage ref="fullscreen" v-model:visible="full_screened" :bg="data.album ? `url(${data.album.cover})` : ''"
        @close="handle_page_close">
        <template #left>
            <img id="full-cover" :src="data.album ? data.album.cover : null">
            <div class="full-title" style="text-align: left">
                <div id="full-title">{{ data.title }}</div>
                <div id="full-artist"
                    @click="() => { $refs.fullscreen.handleClose(); display_artist(data.artists[0]) }">
                    {{ data.artists[0].name }}
                </div>
            </div>
            <div class="full-slider colbox">
                <div>{{ toTime(current) }}</div>
                <input id="full-input-range" type="range" :value="current" :max="data.duration"
                    @input="(e) => changeLong(Number(e.target.value))" />
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
            <div id="lyrics" ref="lyrics">
                <div class="lyric" v-for="l in data.lyric" :key="l.t" @click="() => { play(); changeLong(l.t); }">
                    <div> {{ l.c }}</div>
                    <div class="full-translate-lyric"> {{ l.tc }}</div>
                </div>
            </div>
        </template>
    </CPage>
    <div ref="player" id="player">
        <div id="slider">
            <el-slider size="small" v-model="current" :max="data.duration" :show-tooltip="false"
                @input="changeLong"></el-slider>
        </div>
        <audio :src="data.music_url" @canplay="showLong" ref="audio" autoplay="" @timeupdate="getCurr"
            @pause="is_stop = true" @play="is_stop = false" @ended="ended"></audio>
        <div id="player-ui">
            <div id="left">
                <img @click="open_fullscreen" id="album-cover" :src="data.album ? data.album.cover : null">
                <div style="text-align: left;width: 100%;overflow: hidden;">
                    <p class="hide_text" id="title">{{ data.title }}</p>
                    <div class="hide_text" id="artist">
                        <el-link v-if="data.artists" @click="display_artist(data.artists[0])">{{ data.artists[0].name
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
    <div ref="show_button" id="show_button" @click="show">
        <box-icon color="#EEEEEE" type='solid' name='music'></box-icon>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import CDrawer from './UI/CDrawer.vue'
import CPage from './UI/CPage.vue'

export default {
    name: 'MusicPlayer',
    components: {
        CDrawer, CPage
    },
    props: {
    },
    data() {
        return {
            data: {
                music_url: "",
                duration: 0,
                album_img: "",
                title: "未播放歌曲",
            },
            current: "100",
            isPlaying: "play",
            list_show: false,
            playlist: [],
            current_playing: 0,
            mode: 0,
            modes: ['列表循环', '单曲循环', '随机播放'],
            full_screened: false
        }
    },
    methods: {
        open_fullscreen() {
            if (!this.data.lyric) {
                this.$axios.post("/func", {
                    target: "get_lyric",
                    data: {
                        id: this.data.id
                    }
                }).then((res) => {
                    this.data.lyric = [];
                    if (typeof res.data.lyric === 'string') {
                        let arr = res.data.lyric.split('\n');
                        for (let ele of arr) {
                            let first_index = ele.indexOf('[');
                            let second_index = ele.indexOf(']');
                            if (first_index != undefined && second_index) {
                                let time = ele.substring(first_index + 1, second_index);
                                let third_index = time.indexOf(':');
                                let t = Number(time.substring(0, third_index)) * 60 + Number(time.substring(third_index + 1));
                                this.data.lyric.push({ t, c: ele.substring(second_index + 1) });
                            }
                            else this.data.lyric.push({ t: 0, c: ele })
                        }
                        if (res.data.tlyric) {
                            let arr_t = res.data.tlyric.split('\n');
                            let index = 0;
                            for (let ele of arr_t) {
                                let first_index = ele.indexOf('[');
                                let second_index = ele.indexOf(']');
                                if (first_index != undefined && second_index) {
                                    let time = ele.substring(first_index + 1, second_index);
                                    let third_index = time.indexOf(':');
                                    let t = Number(time.substring(0, third_index)) * 60 + Number(time.substring(third_index + 1));
                                    while(index < this.data.lyric.length - 1 && this.data.lyric[index+1].t <= t) index++;
                                    this.data.lyric[index].tc = ele.substring(second_index + 1);
                                }
                            }
                        }
                    }
                    this.render_lyric();
                });
            }
            else this.render_lyric();
        },
        render_lyric() {
            this.full_screened = true;
            this.currentLyric = 0;
            setTimeout(()=>this.$refs.lyrics.children[this.currentLyric].classList.add('current-lyric'),0)
            this.lyricSelector = setInterval(() => {
                if (this.isPlaying === 'pause') {
                    let ct = parseInt(this.$refs.audio.currentTime);
                    let cl = this.currentLyric;
                    let next = cl;
                    while (this.data.lyric[next] && ct > this.data.lyric[next].t) next++;
                    if (next > cl + 1) {
                        this.$refs.lyrics.children[cl].classList.remove('current-lyric');
                        this.$refs.lyrics.children[next - 1].classList.add('current-lyric');
                        this.$refs.lyrics.scrollTo({
                            top: this.$refs.lyrics.children[next - 1].offsetTop - 200,
                            behavior: "smooth"
                        })
                        this.currentLyric = next - 1;
                    }
                }
            }, 100)
        },
        handle_page_close() {
            if (this.lyricSelector) {
                clearInterval(this.lyricSelector);
                console.log('close');
            }
        },
        toTime(sec) {
            let s = sec % 60 < 10 ? ('0' + sec % 60) : sec % 60
            let min = Math.floor(sec / 60) < 10 ? ('0' + Math.floor(sec / 60)) : Math.floor(sec / 60)
            return min + ':' + s
        },
        getCurr() { this.current = parseInt(this.$refs.audio.currentTime); },
        showLong() { this.data.duration = parseInt(this.$refs.audio.duration); },
        changeLong(ct) {
            this.$refs.audio.currentTime = ct;
        },
        plays() {
            if (this.isPlaying == "play") {
                this.$refs.audio.play();
                this.isPlaying = "pause";
            } else {
                this.$refs.audio.pause()
                this.isPlaying = "play";
            }
        },
        find_index(id){
            for(let index in this.playlist){
                if(this.playlist[index].id === id) return index;
            }
            return -1;
        },
        init(data) {
            if(data.id){
                let index = this.find_index(data.id);
                if(index === -1){
                    this.playlist.push(data);
                    this.change(this.playlist.length - 1);
                }
                else this.change(index);
            }
        },
        nextPlay(data){
            if(data.id){
                let index = this.find_index(data.id);
                if(index === -1){
                    this.playlist.splice(this.current_playing+1,0,data);
                    ElMessage("已添加至播放列表");
                }
                else if(index != this.current_playing){
                    let song = this.playlist.splice(index,1);
                    if(index < this.current_playing) this.current_playing -=1;
                    this.playlist.splice(this.current_playing+1,0,song[0]);
                }
            }
        },
        change(index) {
            this.isPlaying = "pause";
            // this.data = {};
            let quality = "exhigh";
            let settings = this.$store.state.settings;
            if (settings && settings.quality) {
                quality = settings.quality;
            }
            this.$axios.post("func", {
                target: "get_song_url",
                data: {
                    id: this.playlist[index].id,
                    level: quality
                }
            }).then((result) => {
                this.data = this.playlist[index];
                this.data.music_url = result.data.url;
                this.current_playing = index;
                setTimeout(() => this.apply_media_session(this.data), 0)
                if (this.full_screened) this.open_fullscreen();
                this.show();
            })
        },
        remove(index) {
            this.playlist.splice(index, 1);
            if (index === this.current_playing) {
                if (this.playlist.length === 0) {
                    this.data = {
                        music_url: "",
                        duration: 0,
                        album_img: ""
                    };
                }
                else this.change(index);
            }
            else if (index < this.current_playing) {
                this.current_playing -= 1;
            }
        },
        ended() {
            switch (this.mode) {
                default:
                    this.change((this.current_playing + 1) % this.playlist.length);
                    break;
                case 1:
                    this.change(this.current_playing);
                    break;
                case 2: {
                    let rand = parseInt(Math.random() * (this.playlist.length - 1) + 1);
                    this.change((this.current_playing + rand) % this.playlist.length);
                    break;
                }
            }
        },
        next() {
            if (this.mode === 2) {
                let rand = parseInt(Math.random() * (this.playlist.length - 1) + 1);
                this.change((this.current_playing + rand) % this.playlist.length);
            }
            else this.change((this.current_playing + 1) % this.playlist.length);
        },
        prev() {
            if (this.mode === 2) {
                let rand = parseInt(Math.random() * (this.playlist.length - 1) + 1);
                this.change((this.current_playing + rand) % this.playlist.length);
            }
            else {
                let n = this.current_playing - 1;
                let m = this.playlist.length;
                this.change(((n % m) + m) % m);
            }
        },
        show() {
            this.$refs.player.style.display = "block";
            setTimeout(() => {
                this.$refs.player.style.transform = "translate(-50%,0)";
                this.$refs.show_button.style.transform = "translateX(10vw)";
            }, 0)
        },
        hide() {
            this.$refs.player.style.transform = "translate(-50%,30vh)";
            this.$refs.show_button.style.transform = "translateX(0)";
            setTimeout(() => this.$refs.player.style.display = "none", 500);
        },
        change_mode() {
            this.mode = (this.mode + 1) % 3;
            ElMessage({
                type: 'info',
                message: this.modes[this.mode]
            })
        },
        listen_all(queue) {
            this.playlist = queue;
            this.change(0);
        },
        display_album(item) {
            this.list_show = false
            this.$router.push(`./album?id=${item.id}`);
        },
        display_artist(item) {
            this.list_show = false
            this.$router.push(`./artist?id=${item.id}`);
        },
        play() {
            this.isPlaying = "pause"; this.$refs.audio.play();
        },
        pause() {
            this.isPlaying = "play"; this.$refs.audio.pause();
        },
        apply_media_session(data) {
            if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: data.title,
                    artist: data.artists[0].name,
                    album: data.album.name,
                    artwork: [
                        { src: data.album.cover, type: 'image/jpeg', sizes: "1024x1024" },
                    ]
                });
                const actionHandlers = [
                    ['play', this.play],
                    ['pause', this.pause],
                    ['previoustrack', this.prev],
                    ['nexttrack', this.next],
                ];
                for (const [action, handler] of actionHandlers) {
                    try {
                        navigator.mediaSession.setActionHandler(action, handler);
                    } catch (error) {
                        console.log(`The media session action "${action}" is not supported yet.`);
                    }
                }
            }

        },
        download() {
            this.$store.state.queue.add(this.playlist[this.current_playing]);
        }
    },
    created() {
        this.$store.state.player = {
            listen:(data)=>this.init(data),
            listen_all:(data)=>this.listen_all(data),
            next:(data)=>this.nextPlay(data),
        }
    }
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
    /* height: 12px; */
    background-color: transparent;
    /* backdrop-filter: blur(5px); */
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