<template>
    <el-container id="main_content" style="padding: 10px;" class="container">
        <el-header>
            <p style="font-size: 30px;margin: 0;">下载管理</p>
        </el-header>
        <el-main>
            <el-table :data="queue" style="height:100%;width: 100%">
                <el-table-column prop="title" label="名称" />
                <el-table-column prop="artists" label="歌手" />
                <el-table-column prop="album" label="专辑" />
                <el-table-column fixed="right" label="操作" width="500">
                    <template #default="scope">
                        <div v-if="queue[scope.$index].status == 0" style="display: flex;flex-direction: row;">
                            等待下载...
                            <el-button link type="danger" size="small" @click="remove_row(scope.$index)">移除</el-button>
                        </div>
                        <div v-if="queue[scope.$index].status == 1" style="display: flex;flex-direction: row;">
                            等待服务器...
                        </div>
                        <div v-if="queue[scope.$index].status == 2">
                            <el-progress :percentage="queue[scope.$index].prog * 100"
                                style="width: 80%;"></el-progress>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-button v-on:click="download" type="primary" style="margin-left: 20px;">下载</el-button>
        </el-footer>
    </el-container>
</template>

<script>
import { ElNotification } from 'element-plus'

export default {
    name: 'DownloadPage',
    data() {
        return {
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
            task_remain: 0,
            queue:[]
        }
    },
    methods: {
        remove_row(index) {
            this.$store.state.queue.del(index);
        },
        count(message) {
            let index = JSON.parse(message.data).message;
            this.queue[index].current += 1;
            this.task_remain -= 1;
            if (this.task_remain === 0) {
                this.queue.splice(0);
                this.socket.close();
                ElNotification({
                    title: '成功',
                    message: '下载完成',
                    type: 'success',
                });
            }
        },
        download(){
            this.$store.state.queue.download();
        }
    },
    created(){
        this.queue = this.$store.state.queue.inner_queue;
    }
}
</script>

<style scoped>
#main_content {
    text-align: left;
    height: 100%;
}
</style>