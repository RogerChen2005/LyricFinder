<template>
    <el-container id="main_content" style="padding: 10px;">
        <el-header>
            <p style="font-size: 30px;margin: 0;">下载管理</p>
        </el-header>
        <el-main>
            <el-table :data="list" style="height:100%;width: 100%">
                <el-table-column prop="title" label="名称"/>
                <el-table-column prop="artists" label="歌手"/>
                <el-table-column prop="album" label="专辑"/>
                <el-table-column fixed="right" label="操作" width="500">
                    <template #default="scope">
                        <div style="display: flex;flex-direction: row;">
                            <el-progress></el-progress>
                            <el-button link type="danger" size="small" @click="remove_row(scope.$index)">移除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <el-button type="primary" v-on:click="songlist_save" style="margin-right: 20px;">保存</el-button>
            <el-checkbox v-model="d_song">歌曲</el-checkbox>
            <el-select multiple v-model="bitrate" placeholder="请选择音质" style="margin-right: 20px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-checkbox v-model="d_lyric">歌词</el-checkbox>
            <el-checkbox v-model="d_cover">封面</el-checkbox>
            <el-button v-on:click="download" type="primary" style="margin-left: 20px;">下载</el-button>
        </el-footer>
    </el-container>
</template>

<script>
export default {
    name: 'DownloadPage',
    props: {
        queue:Array
    },
    data() {
        return {
            list:this.queue
        }
    },
    methods: {
        remove_row(index){
            this.list.splice(index,1);
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