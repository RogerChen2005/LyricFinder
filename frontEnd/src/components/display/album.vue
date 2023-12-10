<template>
    <el-container class="container">
        <el-main v-loading="loading">
            <div class="colbox" id="container">
                <img id="cover" :src="detail.cover_img"/>
                <div class="rowbox" style="justify-content: space-between;">
                    <div id="name">{{ detail.name }}</div>
                    <div id="description">{{ detail.description }}</div>
                    <div id="count">共 {{detail.count}} 首 {{ (new Date(detail.create_time)).toDateString() }}</div>
                    <el-button @click="listen_all" type="primary" style="width: 200px;"><box-icon color="white"
                    name='add-to-queue'></box-icon>播放整页</el-button>
                </div>
            </div>
            <el-table :data="list" style="width: 100%;">
                <el-table-column type="index" />
                <el-table-column prop="title" label="名称" />
                <el-table-column prop="artists" label="歌手" />
                <el-table-column prop="album" label="专辑" />
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <div style="display: flex;flex-direction: row;">
                            <el-button link type="warning" @click="listen_temporary(scope.$index)"
                                size="small">播放</el-button>
                            <el-button link type="primary" @click="add(scope.$index)" size="small">下载</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import axios from "axios";

export default {
    name: "albumPage",
    data() {
        return {
            id: 0,
            count: 0,
            list: [],
            list_name: "",
            visible: false,
            loading:true,
            load: () => { } ,
            detail:{}
        }
    },
    methods: {
        async listen_temporary(index) {
            let data = this.list[index];
            this.$store.state.trylisten(data);
        },
        add(index) {
            this.$store.state.queue.add(this.list[index]);
        },
        listen_all() {
            this.$store.state.listen_all(this.list);
        },
        init(){
            this.loading=true;
            axios.post('/func',{
                target:"get_album",
                data:{
                    id:this.id,
                }
            }).then((res)=>{
                this.detail = res.data.detail;
                this.list = res.data.songs;
                this.loading=false;
            })
        }
    },
    created() {
        this.id = this.$route.query.id;
        if (this.id) this.init();
    }
}
</script>

<style scoped>
#container{
    margin: 20px;
    margin-left: 0;
}
#cover{
    width: 180px;
    height: 180px;  
    margin-right: 20px;
    border-radius: 10px;    
}
#description{
    font-size: 18px;
    font-weight: 500;
}
#name{
    font-size: 40px;
    font-weight: 800;
}
</style>
