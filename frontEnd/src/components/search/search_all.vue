<template>
    <div id="main_container">
        <div class="title">
            <div>单曲</div><el-link :href="`/#/search/song?key=${key}&page=1`">{{ moreText.song }}</el-link>
        </div>
        <el-table :data="songs" style="width: 100%;">
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
                        <el-button link type="warning" @click="listen_temporary(scope.$index)" size="small">播放</el-button>
                        <el-button link type="primary" @click="add(scope.$index)" size="small">下载</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="title">
            <div>专辑</div><el-link :href="`/#/search/album?key=${key}&page=1`">{{ moreText.album }}</el-link>
        </div>
        <div class="colbox col-container">
            <el-card v-on:click="display_album(item)" v-for="item in albums" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.artist }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                </div>
            </el-card>
        </div>
        <div class="title">
            <div>歌手</div><el-link :href="`/#/search/artist?key=${key}&page=1`">{{ moreText.artist }}</el-link>
        </div>
        <div class="colbox col-container">
            <el-card v-on:click="display_artist(item)" v-for="item in artists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                </div>
            </el-card>
        </div>
        <div class="title">
            <div>歌单</div><el-link :href="`/#/search/list?key=${key}&page=1`">{{ moreText.list }}</el-link>
        </div>
        <div class="colbox col-container">
            <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                :body-style="{ padding: '10px', textAlign: 'left' }">
                <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                <div style="padding: 5px;overflow: hidden;">
                    <p style="margin:0;padding:0;font-size: 14px;">{{ item.name }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.creator }}</p>
                    <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SearchPage',
    data() {
        return {
            songs: [],
            albums: [],
            lists: [],
            artists:[],
            search_loading: false,
            key: "",
            type: 1,
            moreText:{}
        }
    },
    methods: {
        async add(index) {
            let item = this.songs[index];
            let result = await this.$axios.post("func", {
                target: "get_song_detail",
                data: {
                    id: "" + item.id,
                }
            })
            item.album_img = result.data.album_img;
            this.$store.state.queue.add(item);
        },
        search_query() {
            this.search_loading = true;
            this.$axios.post("func",{
                target: "search_all",
                data: {
                    key: this.key,
                }
            }
            ).then(
                (response) => {
                    this.songs = response.data.songs;
                    this.albums = response.data.albums;
                    this.lists = response.data.lists;
                    this.artists = response.data.artists;
                    this.moreText = response.data.moreText;
                    this.search_loading = false;
                }
            );

        },
        async listen_temporary(i) {
            let data = this.songs[i];
            let result = await this.$axios.post("func",{
                target: "get_song_detail",
                data: {
                    id: "" + data.id,
                }
            })
            data.album_img = result.data.album_img;
            this.$store.state.trylisten(data);
        },
        display_album(item) {
            this.$router.push(`./album?id=${item.id}`);
        },
        display_list(item) {
            this.$router.push(`./playlist?id=${item.id}`);
        },
        display_artist(item) {
            this.$router.push(`./artist?id=${item.id}`);
        },
    },
    created() {
        this.key = this.$route.query.key;
        if (this.key) this.search_query();
    },
    watch: {
        '$route.query': function () {
            this.key = this.$route.query.key;
            if (this.key) this.search_query();
        }
    }
}
</script>

<style scoped>
@keyframes enter {
    0% {
        transform: translateY(300px);
        opacity: 0;
    }

    100% {
        transform: translateY(0%);
        opacity: 1;
    }
}

.title{
    display: flex;
    flex-direction: row;
    margin: 10px;
    align-items: baseline;
}

.title div{
    font-size: 20px;
    font-weight: 800;
    margin-right: 20px;
}
.col-container{
    flex-wrap: wrap;
    overflow-x: auto;
}

#main_container {
    height: 100%;
    width:calc(100% - 20px);
    overflow:auto;
    margin-left: 20px;
}

.r-card {
    border-radius: 10px;
    padding: 0;
    margin-bottom: 10px;
}

.footer {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>