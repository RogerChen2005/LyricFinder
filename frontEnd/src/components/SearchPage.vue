<template>
    <el-container id="main_content">
        <el-main>
            <div id="search">
                <el-input @keyup="key_check" v-model="search" placeholder="请输入内容"> </el-input>
                <el-button v-on:click="search_offset = 0; to_search()" type="primary"
                    style="margin-left: 20px;"><el-icon><box-icon name="search"></box-icon></el-icon>搜索</el-button>
            </div>
            <div style="height:20px;margin-bottom: 10px;padding-left: 10px;display: flex;color: #606266;">
                <el-col :span="8">
                    标题
                </el-col>
                <el-col :span="6">
                    歌手
                </el-col>
                <el-col :span="6">
                    专辑
                </el-col>
                <div style="width: 230px;"></div>
            </div><br />
            <div v-loading="search_loading">
                <el-card v-for="i in searchlist" :key="i.id" class="r-card" body-style="padding:10px;display: flex;
                    flex-direction: row;align-items: center;height:50px;" shadow="hover">
                    <el-col :span="8">
                        <div class="hide_text" style="font-size: 20px;">{{ i.title }}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="hide_text" style="font-size: 14px;">{{ i.artists }}</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="hide_text" style="font-size: 14px;">{{ i.album }}</div>
                    </el-col>
                    <el-button v-on:click="listen_temporary(i)" style="margin-left: 20px;">预览</el-button>
                    <el-button v-on:click="add(i)" type="primary" style="margin-left: 20px;">添加</el-button>
                </el-card>
            </div>
        </el-main>
        <el-footer class="footer">
            <el-pagination @current-change="handle_page_change" :default-page-size="30" background
                layout="prev, pager, next,jumper" :total="count" />
            <el-text>总共{{count}}个搜索结果</el-text>
        </el-footer>
    </el-container>
</template>

<script>
import axios from 'axios';

axios.defaults.withCredentials = true;

export default {
    name: 'SearchPage',
    props: {
        trylisten: Function,
        add_item: Function
    },
    data() {
        return {
            count: 0,
            searchlist: [],
            search: "",
            search_loading:false
        }
    },
    methods: {
        to_search() {
            this.search_query(1, (result) => {
                {
                    this.searchlist = result.songs;
                    this.count = result.count;
                }
            });
        },
        add(i) {
            this.add_item(i);
        },
        search_query(index, callback) {
            this.search_loading = true;
            axios.post("http://localhost:3030/func", {
                target: "search_query",
                data: {
                    key: this.search,
                    offset: (index - 1) * 30
                }
            }
            ).then(
                (response) => {
                    if (typeof callback === 'function') {
                        callback(response.data);
                        this.search_loading = false;
                    }
                }
            );
            
        },
        async listen_temporary(i) {
            let data = i;
            let result = await axios.post("http://localhost:3030/func", {
                target: "get_song_url",
                data: {
                    id: i.id,
                    level: "standard"
                }
            })
            data.music_url = result.data.url;
            result = await axios.post("http://localhost:3030/func", {
                target: "get_song_detail",
                data: {
                    id: "" + i.id,
                }
            })
            data.album_img = result.data.album_img;
            this.trylisten(data);
        },
        key_check(e) {
            if (e.keyCode === 13) {
                this.to_search();
            }
        },
        handle_page_change(val) {
            this.search_query(val,(result)=>{
                this.searchlist = [];
                this.searchlist = result.songs;
            })
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

div {
    text-align: left;
    padding: 10px;
}

div #search {
    display: flex;
    align-items: center;
}

#main_content {
    height: 100%;
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