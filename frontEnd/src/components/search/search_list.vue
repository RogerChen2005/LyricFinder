<template>
    <el-container class="container">
        <el-main v-loading="loading" class="colbox" style="flex-wrap: wrap;width: 100%;">
            <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.artist }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                </div>
            </el-card>
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

export default {
    name: 'SearchPage',
    data() {
        return {
            count: 0,
            lists: [],
            search_loading:false,
            key:"",
            page:1,
            loading:false
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
            this.loading = true;
            axios.post("/func", {
                target: "search_list",
                data: {
                    key: this.key,
                    offset: (index - 1) * 30,
                }
            }
            ).then(
                (response) => {
                    this.lists = response.data.lists;
                    this.count = response.data.count;
                    this.loading = false;
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
            this.$router.push(`/search/list?key=${this.key}&page=${val}`);
        },
        display_list(item) {
            this.$router.push(`/playlist?id=${item.id}`);
        },
    },
    created(){
        this.key = this.$route.query.key;
        this.page = Number(this.$route.query.page)|| 1;
        if(this.key) this.search_query(this.page);
    },
    watch:{
    '$route.query':function(){
        this.key = this.$route.query.key;
        this.page = Number(this.$route.query.page)|| 1;
        if(this.key) this.search_query(this.page);
    }
  }
}
</script>

<style scoped>

.footer {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>