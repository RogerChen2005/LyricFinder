<template>
    <div class="container">
        <el-result v-if="!isLogin" icon="error" title="未登录" sub-title="请先登陆">
        </el-result>
        <el-container v-if="isLogin" style="height: 100%;">
            <el-header class="colbox" style="justify-content: space-between;align-items: center;height: 60px;">
                <div style="font-weight: 600;font-size: 25px;">{{ nickname }} 的歌单</div>
                <el-button style="margin: 20px;" type="primary" @click="get_songlist"><box-icon color="white"
                        name='refresh'></box-icon>刷新歌单</el-button>
            </el-header>
            <el-main v-loading="loading" style="padding:10px;padding-top:0;overflow: auto;height:100px">
                <div id="main">
                    <el-card v-on:click="open(item)" v-for="item in display_list" :key="item.img_url"
                        class="songlist_card" :body-style="{ padding: '10px', textAlign: 'left' }">
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
import axios from "axios";
import { ElNotification } from 'element-plus'

export default {
    name: 'SongList',
    data() {
        return {
            user_list: [],
            display_list: [],
            isLogin: true,
            uid: 0,
            total: 0,
            offset: 0,
            loading: false,
            nickname:"",
        }
    },
    methods: {
        get_songlist() {
            this.loading = true;
            axios.post("/func", {
                target: "get_playlist",
                data: {
                    uid: this.uid,
                    cookie: localStorage.getItem("cookie")
                }
            }).then(
                (res) => {
                    localStorage.setItem('list', JSON.stringify(res.data.list));
                    this.refresh();
                    this.handle_page_change(1);
                    this.loading = false;
                    ElNotification({
                        title: 'Success',
                        message: '刷新成功',
                        type: 'success',
                    });
                }
            );
        },
        open(item) {
            this.$router.push(`/playlist?id=${item.id}`);
        },
        refresh() {
            let profile = JSON.parse(localStorage.getItem('profile'));
            if (profile != null) {
                this.isLogin = true;
                this.uid = profile['userid'];
                this.nickname = profile['nickname'];
            }
            else {
                this.isLogin = false;
                return;
            }
            let list = JSON.parse(localStorage.getItem('list'));
            if (list != null) {
                this.user_list = list;
                this.total = list.length;
            }
            else {
                this.get_songlist();
            }
            return;
        },
        handle_page_change(val) {
            this.display_list = this.user_list.slice((val - 1) * 30, val * 30);
        },
    },
    created: function () {
        this.refresh();
        this.handle_page_change(1);
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