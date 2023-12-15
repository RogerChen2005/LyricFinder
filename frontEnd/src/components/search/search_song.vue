<template>
    <el-container id="main_content" class="container">
        <el-main>
            <div style="height:20px;margin-bottom: 10px;padding-left: 10px;display: flex;color: #606266;">
                <el-col :span="8">
                    标题
                </el-col>
                <el-col :span="6">
                    歌手
                </el-col>
                <el-col :span="6">
                    专辑
                </el-col>
                <div style="width: 230px;"></div>
            </div><br />
            <div v-loading="search_loading">
                <el-card v-for="i in searchlist" :key="i.id" class="r-card" body-style="padding:10px;display: flex;
                    flex-direction: row;align-items: center;height:50px;" shadow="hover">
                    <el-col :span="8">
                        <div class="hide_text" style="font-size: 20px;">{{ i.title }}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="hide_text" style="font-size: 14px;">{{ i.artists }}</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="hide_text" style="font-size: 14px;">{{ i.album }}</div>
                    </el-col>
                    <el-button v-on:click="listen_temporary(i)" style="margin-left: 20px;">播放</el-button>
                    <el-button v-on:click="add(i)" type="primary" style="margin-left: 20px;">下载</el-button>
                </el-card>
            </div>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_page_change" :current-page="page" :default-page-size="30" background
                layout="prev, pager, next,jumper" :total="count" />
            <el-text>总共{{count}}个搜索结果</el-text>
        </el-footer>
    </el-container>
</template>

<script>
import axios from 'axios';

// axios.defaults.withCredentials = true;

export default {
    name: 'SearchPage',
    data() {
        return {
            count: 0,
            searchlist: [],
            search: "",
            search_loading:false,
            key:"",
            page:1,
            type:1
        }
    },
    methods: {
        async add(i) {
            let result = await axios.post("/func", {
                target: "get_song_detail",
                data: {
                    id: "" + i.id,
                }
            })
            i.album_img = result.data.album_img;
            this.$store.state.queue.add(i);
        },
        search_query(index) {
            this.search_loading = true;
            axios.post("/func", {
                target: "search_song",
                data: {
                    key: this.key,
                    offset: (index - 1) * 30,
                    type:this.type
                }
            }
            ).then(
                (response) => {
                    this.searchlist = response.data.songs;
                    this.count = response.data.count;
                    this.search_loading = false;
                }
            );
            
        },
        async listen_temporary(i) {
            let data = i;
            let result = await axios.post("/func", {
                target: "get_song_detail",
                data: {
                    id: "" + i.id,
                }
            })
            data.album_img = result.data.album_img;
            this.$store.state.trylisten(data);
        },
        handle_page_change(val) {
            this.$router.push(`/search/song?key=${this.key}&page=${val}`);
        }
    },
    created(){
        this.key = this.$route.query.key;
        this.page = this.$route.query.page || 1;
        if(this.key) this.search_query(this.page);
    },
    watch:{
    '$route.query':function(){
        this.key = this.$route.query.key;
        this.page = this.$route.query.page || 1;
        if(this.key) this.search_query(this.page);
    }
  }
}
</script>

<style scoped>

div {
    text-align: left;
    padding: 10px;
}

#main_content {
    height: 100%;
}

.r-card {
    border-radius: 10px;
    padding: 0;
    margin-bottom: 10px;
}

</style>