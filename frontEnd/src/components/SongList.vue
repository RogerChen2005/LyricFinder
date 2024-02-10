<template>
    <div class="container">
        <el-container style="height: 100%;">
            <el-header class="colbox" style="justify-content: space-between;align-items: center;height: 60px;">
                <div style="font-weight: 600;font-size: 25px;"> 歌单</div>
                <el-button style="margin: 20px;" type="primary" @click="get_songlist"><box-icon color="white"
                        name='refresh'></box-icon>刷新歌单</el-button>
            </el-header>
            <el-main v-loading="loading" style="padding:10px;padding-top:0;overflow: auto;height:100px">
                <div id="main">
                    <el-card v-on:click="open(item)" v-for="item in display_list" :key="item.img_url" class="songlist_card"
                        :body-style="{ padding: '10px', textAlign: 'left' }">
                        <img style="width: 100%;border-radius: 5px;" :src="item.img_url">
                        <div style="padding: 5px;overflow: hidden;">
                            <p style="margin:0;padding:0;font-size: 14px;">{{ item.list_name }}</p>
                            <p style="margin:0;padding:0;font-size: 8px;">{{ item.count }}首</p>
                        </div>
                    </el-card>
                </div>
            </el-main>
            <el-footer class="footer">
                <el-pagination @current-change="handle_page_change" :default-page-size="30" background
                    layout="prev, pager, next,jumper" :total="total" />
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import { ElNotification } from 'element-plus'

export default {
    name: 'SongList',
    data() {
        return {
            user_list: [],
            display_list: [],
            uid: 0,
            total: 0,
            offset: 0,
            loading: false,
            nickname: "",
        }
    },
    methods: {
        get_songlist() {
            this.loading = true;
            this.$store.state.data.update("private_list", (data) => {
                this.refresh(data.list);
                ElNotification({
                    title: 'Success',
                    message: '刷新成功',
                    type: 'success',
                });
                this.handle_page_change(1);
                this.loading = false;
            }, (err) => {
                console.log(err);
                ElNotification({
                    title: 'Error',
                    message: '歌单获取失败',
                    type: 'error',
                });
            });
        },
        open(item) {
            this.$router.push(`/playlist?id=${item.id}`);
        },
        refresh(list) {
            this.user_list = list;
            this.total = list.length;
        },
        handle_page_change(val) {
            this.display_list = this.user_list.slice((val - 1) * 30, val * 30);
        },
    },
    created: function () {
        this.loading = true;
        this.$store.state.data.gets("private_list", (data) => {
            this.refresh(data.list);
            this.handle_page_change(1);
            this.loading = false;
        }, (err) => {
            console.log(err);
            ElNotification({
                title: 'Error',
                message: '歌单获取失败',
                type: 'error',
            });
        })
    }
}
</script>

<style scoped>
#main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.footer {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
</style> 