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

export default {
    name: 'DownloadPage',
    data() {
        return {
            queue:[]
        }
    },
    methods: {
        remove_row(index) {
            this.$store.state.queue.del(index);
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