<template>
    <div class="container">
        <el-result v-if="!isLogin" icon="error" title="未登录" sub-title="请先登陆">
        </el-result>
        <el-container v-if="isLogin" style="height: 100%;">
            <el-header class="colbox" style="justify-content: space-between;align-items: center;">
                <div style="font-weight: 600;font-size: 20px;">{{ nickname }} 的歌单</div>
                <el-button style="margin: 20px;" type="primary" @click="get_songlist"><box-icon color="white"
                        name='refresh'></box-icon>刷新歌单</el-button>
            </el-header>
            <el-main v-loading="loading" style="padding:10px;overflow: auto;height:100px">
                <div id="main">
                    <el-card v-on:click="open_drawer(item)" v-for="item in display_list" :key="item.img_url"
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
        <el-drawer size="70%" :with-header="false" v-model="drawer.visible" :show-close="false" style="overflow:auto;">
            <el-container style="height: 100%;">
                <el-header height="40px"
                    style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
                    <div>{{ drawer.list_name }}</div>
                    <el-button @click="listen_all" type="primary"><box-icon color="white" name='add-to-queue'></box-icon>播放全部</el-button>
                </el-header>
                <el-main>
                    <el-table :data="drawer.list" style="width: 100%;">
                        <el-table-column type="index" />
                        <el-table-column prop="title" label="名称" />
                        <el-table-column prop="artists" label="歌手" />
                        <el-table-column prop="album" label="专辑" />
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
                </el-main>
                <el-footer class="footer">
                    <el-pagination @current-change="handle_drawer_page_change" :default-page-size="30" background
                        layout="prev, pager, next,jumper" :total="drawer.count" />
                </el-footer>
            </el-container>
        </el-drawer>
    </div>
</template>

<script>
import axios from "axios";
import { ElNotification } from 'element-plus'

export default {
    name: 'SongList',
    props: {
        add_item: Function
    },
    data() {
        return {
            user_list: [],
            display_list: [],
            drawer: {
                id: 0,
                count: 0,
                list: [],
                list_name: "",
                visible: false,
                loading: false,
                load: () => { }
            },
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
        open_drawer(item) {
            this.drawer.id = item.id;
            this.drawer.list_name = item.list_name;
            this.drawer.count = item.count;
            this.handle_drawer_page_change(1);
            this.drawer.visible = true;
        },
        handle_drawer_page_change(index) {
            this.drawer.loading = true;
            axios.post('/func', {
                target: "get_list_song",
                data: {
                    id: this.drawer.id,
                    offset: (index - 1) * 30
                }
            }).then((res) => {
                this.drawer.list = res.data.songs;
                this.drawer.loading = false;
            })
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
        async listen_temporary(index) {
            let data = this.drawer.list[index];
            this.$store.state.trylisten(data);
        },
        add(index) {
            this.$store.state.queue.add(this.drawer.list[index]);
        },
        listen_all(){
            this.$store.state.listen_all(this.drawer.list);
        }
    },
    created: function () {
        this.refresh();
        this.handle_page_change(1);
    }
}
</script>

<style scoped>
.songlist_card {
    cursor: pointer;
    width: 170px;
    height: 210px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 10px;
    transition: 1s;
    border-radius: 10px;
    transition: .5s;
}

.songlist_card:hover {
    transform: translateY(-10px);
    background-color: var(--bg-color);
}

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