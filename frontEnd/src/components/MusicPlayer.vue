<template>
    <transition name="drawer-show">
        <div v-if="list_show" class="drawer-container" tabindex="-1" @focus="list_show = false">
            <div id="drawer" class="drawer-body" tabindex="-1">
                <div style="display: flex;justify-content: space-between;">
                    <div>
                        <h2>播放列表</h2>
                    </div>
                    <div>
                        <box-icon style="cursor: pointer;" @click="list_show = false" name='x' size='lg'
                            animation='tada-hover'></box-icon>
                    </div>
                </div>
                <el-table :data="playlist" style="width: 100%">
                    <el-table-column fixed="left" label="" width="30">
                        <template #default="header">
                            <box-icon name='volume-full' v-if="current_playing===header.$index" color="#303133" size="xs"></box-icon>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"/>
                    <el-table-column prop="title" label="名称" />
                    <el-table-column prop="artists" label="歌手" />
                    <el-table-column prop="album" label="专辑" />
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
                @change="changeLong()"></el-slider>
        </div>
        <audio :src="data.music_url" @canplay="showLong" ref="audio" autoplay="" @timeupdate="getCurr"
            @pause="is_stop = true" @play="is_stop = false"></audio>
        <div id="player-ui">
            <div id="left">
                <img id="album-cover" :src="data.album_img">
                <div style="text-align: left;">
                    <p id="title">{{ data.title }}</p>
                    <p id="artist">{{ data.artists }}</p>
                </div>
            </div>
            <div id="mid">
                <box-icon name='skip-previous' @click="prev" color='#303133' size='md'></box-icon>
                <box-icon :name='isPlaying' @click="plays" color='#303133' size='lg'></box-icon>
                <box-icon name='skip-next' @click="next" color='#303133' size='md'></box-icon>
            </div>
            <div style="display: flex;flex-direction:row;align-items: center;">
                <div style="display: flex;letter-spacing: 1px;">
                    <div style="">{{ toTime(current) }}</div>/
                    <div style="">{{ toTime(data.duration) }}</div>
                </div>
                <box-icon name='playlist' type='solid' color='#303133' @click="list_show = true;"
                    style="margin: 0 10px 0 10px;cursor: pointer;"></box-icon>
                <box-icon @click="hide" style="margin-right: 10px;cursor: pointer;" name='collapse-alt'></box-icon>
            </div>
        </div>
    </div>
    <div ref="show_button" id="show_button" @click="show">
        <box-icon color="white" type='solid' name='music'></box-icon>
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
                music_url:"",
                duration:0,
                album_img:""
            },
            current: "100",
            isPlaying: "play",
            list_show: false,
            playlist: [],
            current_playing: 0
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
        changeLong() {
            let ct = this.current;
            if (!isNaN(ct)) { this.$refs.audio.currentTime = ct; }
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
            this.data = this.playlist[index];
            this.current_playing = index;
            this.show();
            ElMessage({
                message: '已开始播放',
                type: 'success',
            })
        },
        remove(index){
            this.playlist.splice(index,1);
            if(index === this.current_playing){
                if(this.playlist.length===0){
                    this.data={
                        music_url:"",
                        duration:0,
                        album_img:""
                    };
                }
                else this.change(index);
            }
            else if(index < this.current_playing){
                this.current_playing-=1;
            }
        },
        next() {
            this.change((this.current_playing + 1)%this.playlist.length);
        },
        prev() {
            let n = this.current_playing-1;
            let m = this.playlist.length;
            this.change(((n % m) + m) % m);
        },
        show() {
            this.$refs.player.style.transform = "translate(-50%,0)";
            this.$refs.show_button.style.transform = "translateX(10vw)";
        },
        hide() {
            this.$refs.player.style.transform = "translate(-50%,30vh)";
            this.$refs.show_button.style.transform = "translateX(0)";
        },
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
    transition: 1s cubic-bezier(0.52, 0.02, 0.48, 1);
    z-index: 2000;
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
    height: 70%;
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
    max-width: 20%;
}

#player-ui #mid {
    display: flex;
    flex-direction: row;
    align-items: center;
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
    width: 100%;
    height: 100%;
    z-index: 2002;
    backdrop-filter: blur(10px);
    transition: all 0.5s ease-in-out;
    background: rgba(158, 158, 158, 0.1);
}

.drawer-body {
    position: absolute;
    right: 0;
    padding: 20px;
    width: 50%;
    height: 75%;
    border-radius: 5px;
    top: 5%;
    transition: 0.5s ease-in-out;
    background-color: white;
}

.drawer-show-enter-from,
.drawer-show-leave-to {
    background: rgba(255, 255, 255, 0);
    backdrop-filter: blur(0px);
}

.drawer-show-enter-from .drawer-body,
.drawer-show-leave-to .drawer-body {
    transform: translateX(100%);
}

.drawer-show-enter-to,
.drawer-show-leave-from {
    background: rgba(245, 245, 245, 0.1);
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