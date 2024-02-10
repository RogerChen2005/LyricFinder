<template>
    <transition name="drawer-show">
        <div v-if="list_show" class="drawer-container" tabindex="-1" @focus="list_show = false">
            <div id="drawer" class="drawer-body" tabindex="-1">
                <div style="display: flex;justify-content: space-between;height: 80px;">
                    <div>
                        <h2>播放列表</h2>
                    </div>
                    <div>
                        <box-icon color='var(--text-color)' style="cursor: pointer;" @click="list_show = false" name='x'
                            size='lg' animation='tada-hover'></box-icon>
                    </div>
                </div>
                <el-table :data="playlist" style="width: 100%;">
                    <el-table-column fixed="left" label="" width="30">
                        <template #default="header">
                            <box-icon name='volume-full' v-if="current_playing === header.$index" color='var(--text-color)'
                                size="xs"></box-icon>
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
        </div>
    </transition>
    <div ref="player" id="player">
        <div id="slider">
            <el-slider size="small" v-model="current" :max="data.duration" :show-tooltip="false"
                @input="changeLong"></el-slider>
        </div>
        <audio :src="data.music_url" @canplay="showLong" ref="audio" autoplay="" @timeupdate="getCurr"
            @pause="is_stop = true" @play="is_stop = false" @ended="ended"></audio>
        <div id="player-ui">
            <div id="left">
                <img id="album-cover" :src="data.album ? data.album.cover : null">
                <div style="text-align: left;width: 100%;overflow: hidden;">
                    <p class="hide_text" id="title">{{ data.title }}</p>
                    <p class="hide_text" id="artist">{{ data.artists ? data.artists[0].name : "选择一首歌曲播放" }}</p>
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

export default {
    name: 'MusicPlayer',
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
            modes: ['列表循环', '单曲循环', '随机播放']
        }
    },
    methods: {
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
        init(data) {
            this.playlist.push(data);
            this.change(this.playlist.length - 1);
        },
        change(index) {
            this.isPlaying = "pause";
            // this.data = {};
            let quality = "exhigh";
            let settings = this.$store.settings;
            if (settings && settings.quality) {
                quality = settings.quality;
            }
            this.$axios.post("func",{
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
                console.log(rand, this.playlist.length);
                this.change((this.current_playing + rand) % this.playlist.length);
            }
            else this.change((this.current_playing + 1) % this.playlist.length);
        },
        prev() {
            if (this.mode === 2) {
                let rand = parseInt(Math.random() * (this.playlist.length - 1) + 1);
                console.log(rand, this.playlist.length);
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
    }
}
</script>

<style scoped>
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

.drawer-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
    backdrop-filter: blur(10px);
    transition: all .5s ease-in-out;
    /* background: rgba(158, 158, 158, 0.1); */
    background: transparent;
}

.drawer-body {
    position: absolute;
    right: 0;
    padding: 20px;
    width: 50%;
    height: 75%;
    border-radius: 5px;
    top: 5%;
    /* transition: .5s cubic-bezier(.25, .1, .3, 1.5); */
    transition: .5s ease-out;
    background-color: var(--bg-color);
}

.drawer-show-enter-from,
.drawer-show-leave-to {
    background: transparent;
    backdrop-filter: blur(0px);
}

.drawer-show-enter-from .drawer-body,
.drawer-show-leave-to .drawer-body {
    transform: translateX(100%);
}

.drawer-show-enter-to,
.drawer-show-leave-from {
    background: transparent;
    backdrop-filter: blur(10px);
}

.drawer-show-enter-to .drawer-body,
.drawer-show-leave-from .drawer-body {
    transform: translateX(0);
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