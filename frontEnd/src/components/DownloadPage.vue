<template>
    <el-container id="main_content" style="padding: 10px;">
        <el-header>
            <p style="font-size: 30px;margin: 0;">下载管理</p>
        </el-header>
        <el-main>
            <el-table :data="list" style="height:100%;width: 100%">
                <el-table-column prop="title" label="名称" />
                <el-table-column prop="artists" label="歌手" />
                <el-table-column prop="album" label="专辑" />
                <el-table-column fixed="right" label="操作" width="500">
                    <template #default="scope">
                        <div style="display: flex;flex-direction: row;">
                            <el-progress :percentage="queue[scope.$index].current / queue[scope.$index].total * 100"
                                style="width: 80%;"></el-progress>
                            <el-button link type="danger" size="small" @click="remove_row(scope.$index)">移除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-button type="primary" v-on:click="songlist_save" style="margin-right: 20px;">保存</el-button>
            <el-checkbox v-model="song">歌曲</el-checkbox>
            <el-select v-model="bitrate" placeholder="请选择音质" style="margin-right: 20px;">
                <el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <div v-if="item.vip">
                        <img style="margin-left: 10px;height: 12px" :src="require('@/assets/vip.png')">
                    </div>
                </el-option>
            </el-select>
            <el-checkbox v-model="lyric">歌词</el-checkbox>
            <el-checkbox v-model="cover">封面</el-checkbox>
            <el-button v-on:click="download" type="primary" style="margin-left: 20px;">下载</el-button>
        </el-footer>
    </el-container>
</template>

<script>
import axios from 'axios';
import { ElNotification } from 'element-plus'

export default {
    name: 'DownloadPage',
    props: {
        queue: Array,
    },
    data() {
        return {
            list: this.queue,
            socket: undefined,
            quality: [
                {
                    label: "标准",
                    value: "standard",
                    vip: false
                },
                {
                    label: "极高",
                    value: "exhigh",
                    vip: true
                },
                {
                    label: "无损",
                    value: "lossless",
                    vip: true
                },
                {
                    label: "Hi-Res",
                    value: "hires",
                    vip: true
                },
                {
                    label: "高清环绕声",
                    value: "jyeffect",
                    vip: true
                },
                {
                    label: "沉浸环绕声",
                    value: "sky",
                    vip: true
                },
                {
                    label: "超清母带",
                    value: "jymaster",
                    vip: true
                },
            ],
            bitrate: "lossless",
            song: true,
            lyric: true,
            cover: false,
            task_remain: 0
        }
    },
    methods: {
        remove_row(index) {
            this.list.splice(index, 1);
        },
        count(message) {
            let index = JSON.parse(message.data).message;
            this.list[index].current += 1;
            this.task_remain -= 1;
            if (this.task_remain === 0) {
                this.list.splice(0);
                this.socket.close();
                ElNotification({
                    title: '成功',
                    message: '下载完成',
                    type: 'success',
                });
            }
        },
        download() {
            let options = JSON.parse(localStorage.getItem('settings'));
            if (options) {
                if (!options.save_path) {
                    let task_each = this.song + this.cover + this.lyric;
                    this.task_remain = task_each * this.queue.length;
                    options.song = this.song;
                    options.cover = this.cover;
                    options.lyric = this.lyric;
                    options.cookie = localStorage.getItem('cookie');
                    options.level = this.bitrate;
                    axios.post("http://localhost:3030/func", {
                        target: "download",
                        data: {
                            queue: this.queue,
                            options: options
                        }
                    }).then((res) => {
                        console.log(res);
                        ElNotification({
                            title: '提示',
                            message: '下载已经开始',
                            type: 'info',
                        });
                        let socket = new WebSocket('ws://localhost:3000');
                        this.socket = socket;
                        socket.addEventListener('open', function open() {
                            console.log("Conneced!");
                            socket.removeEventListener('open', open);
                        });
                        socket.addEventListener('message', this.count);
                    })
                    for (let i in this.list) {
                        this.list[i].current = 0;
                        this.list[i].total = task_each;
                    }
                    return;
                }
            }
            ElNotification({
                title: '错误',
                message: '请先设置下载路径',
                type: 'error',
            });
            return;
        }
    },
}
</script>

<style scoped>
#main_content {
    text-align: left;
    height: 100%;
}
</style>