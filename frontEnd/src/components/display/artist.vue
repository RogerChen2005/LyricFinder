<template>
    <el-container class="container">
        <el-main v-loading="loading">
            <div class="colbox" id="container">
                <img id="cover" :src="detail.pic" />
                <div class="rowbox" style="justify-content: space-between;">
                    <div id="name">{{ detail.name }}</div>
                    <el-button @click="listen_all" type="primary" style="width: 200px;"><box-icon color="white"
                            name='add-to-queue'></box-icon>播放热门歌曲</el-button>
                </div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="热门歌曲" name="song">
                    <el-table :data="list" style="width: 100%;">
                        <el-table-column type="index" />
                        <el-table-column prop="title" label="名称" />
                        <el-table-column prop="artists" label="歌手">
                            <template #default="scope">
                                <div v-for="i in scope.row.artists" :key="i.id">
                                    <el-link @click="display_artist(i)">{{ i.name }}</el-link>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="album" label="专辑">
                            <template #default="scope">
                                <el-link @click="display_album(scope.row.album)">{{ scope.row.album.name }}</el-link>
                            </template>
                        </el-table-column>
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
                </el-tab-pane>
                <el-tab-pane label="专辑" name="album">
                    <el-container class="container">
                        <el-main class="colbox" style="flex-wrap: wrap;width: 100%;">
                            <el-card v-on:click="display_album(item)" v-for="item in albums" :key="item.id"
                                class="songlist_card" :body-style="{ padding: '10px', textAlign: 'left' }">
                                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                                <div style="padding: 5px;overflow: hidden;">
                                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.artist }}</p>
                                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                                </div>
                            </el-card>
                        </el-main>
                        <el-footer class="footer">
                            <el-pagination @current-change="handle_page_change" v-model:current-page="page"
                                :default-page-size="30" background layout="prev, pager, next,jumper" :total="count" />
                            <el-text>总共{{ count }}个搜索结果</el-text>
                        </el-footer>
                    </el-container>
                </el-tab-pane>
                <el-tab-pane label="简介" name="description">
                    {{ detail.description ? detail.description : "暂无简介" }}
                </el-tab-pane>
            </el-tabs>
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
            loading: true,
            load: () => { },
            detail: {},
            albums: [],
            activeName: "song"
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
        init() {
            this.loading = true;
            this.detail={};
            axios.post('/func', {
                target: "artist_info",
                data: {
                    id: this.id,
                }
            }).then((res) => {
                this.detail = res.data.info;
                this.list = res.data.songs;
                this.handle_page_change(1);
                this.loading = false;
            })
        },
        handle_page_change(index) {
            axios.post('/func', {
                target: "get_artist_album",
                data: {
                    id: this.id,
                    offset: (index - 1) * 30
                }
            }).then((res) => {
                this.albums = res.data.albums;
                this.count = res.data.count;
            })
        },
        display_album(item) {
            this.$router.push(`/album?id=${item.id}`);
        },
        display_artist(item) {
            this.$router.push(`/artist?id=${item.id}`);
        },
    },
    watch: {
        '$route': function () {
            this.id = Number(this.$route.query.id);
            if (this.id) this.init();
        }
    },
    created() {
        this.id = Number(this.$route.query.id);
        if (this.id) this.init();
    },
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
