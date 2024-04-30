<template>
    <div id="main_container" class="container">
        <div id="title">欢迎使用Lyric Finder</div>
        <div v-loading="loading">
            <div class="title">
                <div>为你推荐的单曲</div>
            </div>
            <SongTable :list="songs"></SongTable>
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
import SongTable from './display/SongTable.vue';

export default {
    name: 'HomePage',
    components:{
        SongTable
    },
    data() {
        return {
            loading: false,
            songs: [],
            lists: [],
        }
    },
    methods: {
        display_list(item) {
            this.$router.push(`./playlist?id=${item.id}`);
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