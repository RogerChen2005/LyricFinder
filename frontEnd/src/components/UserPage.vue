<template>
        <div id="main_content" class="container">
            <div v-if="!isLogin" style="text-align: center;">
                <el-empty description="未登录" />
                <el-button type="primary" @click="$router.push('/login')">登陆</el-button>
            </div>
            <div v-if="isLogin" id="user-page">
                <div id="op">
                    <el-button @click="user_inf" type="primary"><box-icon color="white"
                            name='refresh'></box-icon>刷新登录</el-button>

                    <el-popconfirm @confirm="exit" title="确认退出登录？">
                        <template #reference>
                            <el-button type="danger"><box-icon color="white" name='exit'></box-icon>退出登录</el-button>
                        </template>
                    </el-popconfirm>
                </div>
                <img id="bg" :src="bgurl">
                <div id="mask"></div>
                <el-avatar id="av" :size="150">
                    <img :src="avurl" />
                </el-avatar>
                <el-text id="name">{{ name }} <img v-if="isvip" style="width: 50px;vertical-align: middle;"
                        :src="require('@/assets/vip.png')"></el-text>
                <el-text id="sg">{{ sig }}</el-text>
            </div>
        </div>
</template>
<script>
import axios from 'axios';
import { ElNotification } from 'element-plus'

export default {
    name: 'UserPage',
    props: {
        login: Function
    },
    data() {
        return {
            isLogin: false,
            name: "",
            bgurl: "",
            avurl: "",
            sig: ""
        }
    },
    methods: {
        user_inf() {
            axios.post("http://localhost:3030/func", {
                target: "user_inf",
                data: {
                    cookie: localStorage.getItem("cookie")
                }
            }).then((res) => {
                if (res.data.status != 0) {
                    ElNotification({
                        title: 'Error',
                        message: '刷新失败',
                        type: 'error',
                    });
                    return this.exit();
                }
                ElNotification({
                    title: 'Success',
                    message: '刷新成功',
                    type: 'success',
                });
                localStorage['profile'] = JSON.stringify(res.data);
                return this.refresh();
            });
        },
        refresh() {
            let profile = JSON.parse(localStorage.getItem('profile'));
            if (profile != null) {
                this.isLogin = true;
                this.name = profile['nickname'];
                this.bgurl = profile['backgroundUrl'];
                this.avurl = profile['avatarUrl'];
                this.sig = profile['signature'];
                this.isvip = profile['isvip'];
            }
            return;
        },
        exit() {
            localStorage.removeItem('profile');
            localStorage.removeItem('list');
            this.isLogin = false;
            this.$router.push('/login');
            return;
        }
    },
    created: function () {
        this.refresh();
    }
}
</script>

<style scoped>
#main_content {
    text-align: left;
    padding: 0;
    height: 100%;
}

#user-page {
    align-items: center;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

#bg {
    position: absolute;
    width: 100%;
    z-index: -2;
}

#mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(#FFFFFF00, #FFFFFFAA 25%, #FFFFFFFF 60%);
}

html.dark #mask{
    background: linear-gradient(#00000000, #2b2b2baa 25%, #2b2b2b 60%);
}

#av {
    z-index: 3;
    margin-top: 15%;
}

#name {
    font-size: 50px;
    margin-top: 10px;
}

#sg {
    margin-top: 8px;
    font-size: 18px;
}

#op {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
}
</style>