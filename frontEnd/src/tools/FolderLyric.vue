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

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus'

export default {
    name: 'FolderLyric',
    data() {
        return {
            path: '',
            queue: [],
            loading: false,
            dialog: {
                show: false,
                queue: [],
                key: "",
                index: 0,
                loading: false
            },
            task_remain: 0
        }
    },
    methods: {
        async select_folder() {
            this.path = await window.electronAPI.filePicker();
            this.loading = true;
            let result = await axios.post("http://localhost:3030/func", {
                target: "get_folder_songs",
                data: {
                    path: this.path
                }
            })
            this.queue = result.data.queue;
            this.loading = false;
            return;
        },
        count(message) {
            let index = JSON.parse(message.data).message;
            this.queue[index].current += 1;
            this.task_remain -= 1;
            if (this.task_remain === 0) {
                this.queue.splice(0);
                this.socket.close();
                ElMessage({
                    message: '下载完成',
                    type: 'success',
                });
            }
        },
        download() {
            let options = JSON.parse(localStorage.getItem('settings'));
            this.task_remain = this.queue.length;
            axios.post("http://localhost:3030/func", {
                target: "download",
                data: {
                    queue: this.queue,
                    options: {
                        classify: false,
                        use_origin_name: true,
                        path:this.path,
                        song:false,cover:false,lyric:true,
                        tlyric:options?options.tlyric:true
                    }
                }
            }).then((res) => {
                console.log(res);
                ElMessage({
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
            });
            for (let i in this.queue) {
                this.queue[i].current = 0;
            }
        },
        remove(index) {
            this.queue.splice(index, 1);
            ElMessage({
                message: '已移除',
                type: 'success',
            });
        },
        edit(index) {
            this.dialog.show = true;
            this.dialog.key = this.queue[index].search_key;
            this.dialog.index = index;
            this.handle_page_change(1);
        },
        key_check(e) {
            if (e.keyCode === 13) {
                this.to_search();
            }
        },
        search_query(index, callback) {
            // this.dialog.loading = true;
            axios.post("http://localhost:3030/func", {
                target: "search_query",
                data: {
                    key: this.dialog.key,
                    offset: (index - 1) * 30
                }
            }
            ).then(
                (response) => {
                    console.log(callback);
                    if (typeof callback === "function") {
                        callback(response.data);
                    }
                }
            );

        },
        handle_page_change(val) {
            this.search_query(val, (result) => {
                this.dialog.loading = false;
                this.dialog.queue = result.songs;
                this.dialog.count = result.count;
            })
        },
        choose(index) {
            let dest = this.queue[this.dialog.index];
            let src = this.dialog.queue[index];
            dest.title = src.title;
            dest.id = src.id;
            dest.album = src.album,
            dest.artists = src.artists;
            this.dialog.show = false;
        }
    }
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