<template>
    <el-container class="container">
        <el-main v-loading="loading" class="colbox" style="flex-wrap: wrap;width: 100%;">
            <el-card v-on:click="display_artist(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
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
        search_query(index) {
            this.loading = true;
            this.$axios.post("func",{
                target: "search_artist",
                data: {
                    key: this.key,
                    offset: (index - 1) * 30,
                }
            }
            ).then(
                (response) => {
                    this.lists = response.data.artists;
                    this.count = response.data.count;
                    this.loading = false;
                }
            );
            
        },
        handle_page_change(val) {
            this.$router.push(`/search/list?key=${this.key}&page=${val}`);
        },
        display_artist(item) {
            this.$router.push(`/artist?id=${item.id}`);
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