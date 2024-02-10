<template>
    <div id="main_container" class="container">
        <div id="title">欢迎使用Lyric Finder</div>
        <div v-loading="loading">
            <div class="title">
                <div>为你推荐的单曲</div>
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
                            <el-button link type="warning" @click="listen_temporary(scope.$index)"
                                size="small">播放</el-button>
                            <el-button link type="primary" @click="add(scope.$index)" size="small">下载</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="title">
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
        </div> -->
            <div class="title">
                <div>为你推荐的歌单</div>
            </div>
            <div class="colbox" id="list">
                <el-card v-on:click="display_list(item)" v-for="item in lists" :key="item.id" class="songlist_card"
                    :body-style="{ padding: '10px', textAlign: 'left' }">
                    <img style="height: 150px;width: 150px;border-radius: 5px;" :src="item.cover_img">
                    <div style="padding: 5px;overflow: hidden;">
                        <div style="font-size: 14px;width: 100%;">{{ item.name }}</div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import {ElNotification} from 'element-plus'

export default {
    name: 'HomePage',
    data() {
        return {
            loading: false,
            songs: [],
            lists: [],
        }
    },
    methods: {
        display_album(item) {
            this.$router.push(`./album?id=${item.id}`);
        },
        display_list(item) {
            this.$router.push(`./playlist?id=${item.id}`);
        },
        display_artist(item) {
            this.$router.push(`./artist?id=${item.id}`);
        },
        async listen_temporary(i) {
            let data = this.songs[i];
            let result = await this.$axios.post("func", {
                target: "get_song_detail",
                data: {
                    id: "" + data.id,
                }
            })
            data.album_img = result.data.album_img;
            this.$store.state.trylisten(data);
        },
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
    },
    created() {
        this.loading = true;
        this.$store.state.data.gets("discover", (data) => {
            this.lists = data.lists;
            this.songs = data.songs;
            this.loading = false;
        }, (err) => {
            console.log(err);
            ElNotification({
                title: 'Error',
                message: '刷新失败',
                type: 'error',
            });
        })
    }
}
</script>

<style scoped>
#title {
    margin-top: 15px;
    font-size: 30px;
    font-weight: 500;
}

.title {
    display: flex;
    flex-direction: row;
    margin: 10px;
    align-items: baseline;
    font-size: 14px;
}

#main_container {
    text-align: left;
    padding-left: 50px;
    font-size: 25px;
    line-height: 30px;
    height: 100%;
    overflow: auto;
}

#list {
    flex-wrap: wrap;
}
</style>