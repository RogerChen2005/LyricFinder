<template>
    <el-container class="container">
        <el-main v-loading="loading">
            <div class="colbox" id="container">
                <img id="cover" :src="songlist.cover_img" />
                <div class="rowbox" style="justify-content: space-between;">
                    <div id="name">{{ songlist.name }}</div>
                    <div id="description">{{ songlist.description }}</div>
                    <div id="count">共 {{ songlist.count }} 首 {{ (new Date(songlist.create_time)).toDateString() }}</div>
                    <el-button @click="listen_all" type="primary" style="width: 200px;"><box-icon color="white"
                            name='add-to-queue'></box-icon>播放整页</el-button>
                </div>
            </div>
            <SongTable :list="list"></SongTable>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_drawer_page_change" :default-page-size="30" background
                layout="prev, pager, next,jumper" :total="songlist.count" />
        </el-footer>
    </el-container>
</template>

<script>
import SongTable from './SongTable.vue'
export default {
    name: "albumPage",
    components:{
        SongTable
    },
    data() {
        return {
            id: 0,
            count: 0,
            index_start: 0,
            list: [],
            list_name: "",
            visible: false,
            loading: true,
            load: () => { },
            songlist: {}
        }
    },
    methods: {
        handle_drawer_page_change(index) {
            this.loading = true;
            this.$axios.post("func", {
                target: "get_list_song",
                data: {
                    id: this.id,
                    offset: (index - 1) * 30,
                    cookie: localStorage.getItem("cookie")
                }
            }).then((res) => {
                this.index_start = (index) * 30,
                    this.list = res.data.songs;
                this.loading = false;
            })
        },
        listen_all() {
            this.$store.state.player.listen_all(this.list);
        },
        init() {
            this.$axios.post("func", {
                target: "songlist_detail",
                data: {
                    id: this.id,
                    cookie: localStorage.getItem("cookie")
                }
            }).then((res) => {
                this.songlist = res.data;
                this.handle_drawer_page_change(1);
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
#container {
    margin: 20px;
    margin-left: 0;
}

#cover {
    width: 180px;
    height: 180px;
    margin-right: 20px;
    border-radius: 10px;
}

#description {
    font-size: 18px;
    font-weight: 500;
}

#name {
    font-size: 40px;
    font-weight: 800;
}
</style>
