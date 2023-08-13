<template>
    <transition name="drawer-show">
        <div v-if="login_show" class="drawer-container">
            <div style="align-items: center;display: flex;flex-direction: column;" class="drawer-body">
                <div style="width: 100%; display: flex;justify-content: space-between;">
                    <div>
                        <h2>登陆</h2>
                    </div>
                    <div>
                        <box-icon style="cursor: pointer;" @click="login_show = false" name='x' size='lg'
                            animation='tada-hover'></box-icon>
                    </div>
                </div>
                <div v-if="way_select">
                    <el-button v-on:click="Login_qr(callback)" type="primary" style="margin-left: 20px;">二维码登录（推荐）</el-button>
                    <el-button v-on:click="Login_cookie()" type="success" style="margin-left: 20px;">cookie登录</el-button>
                </div>
                <div v-if="qr_login" style="width: 200px;height: 200px;margin: 0;position: relative;">
                    <div v-if="scan_success" class="mask">
                        <box-icon size="lg" name='check-circle' color='#409EFF'></box-icon>
                        <div>已扫描</div>
                    </div>
                    <div v-if="out_of_date" class="mask">
                        <box-icon size="lg" name='x-circle' color='#F56C6C'></box-icon>
                        <div>已过期</div>
                    </div>
                    <img :src="qrimg" />
                    <el-button v-on:click="back" type="danger" style="margin-left: 20px;">返回</el-button>
                </div>
                <div v-if="cookie_login" style="width: 80%;">
                    <div style="margin-bottom: 20px;">
                        <el-input v-model="input_cookie" type="textarea" placeholder="请输入cookie">
                        </el-input>
                    </div>
                    <div style="display: flex;justify-content: space-around;">
                        <el-button v-on:click="confirm_cookie_login(callback)" type="primary" style="margin-left: 20px;">登录</el-button>
                        <el-button v-on:click="back" type="danger" style="margin-left: 20px;">返回</el-button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios';
import { ElButton, ElNotification } from 'element-plus'
const path = "http://localhost:3030/"
export default {
    name: 'UserLogin',
    props: {},
    data() {
        return {
            login_show: false,
            scan_success: false,
            out_of_date: false,
            qrimg: "",
            key: "",
            qr_login: false,
            cookie_login: false,
            way_select: true,
            input_cookie: "",
            callback: Function,
            timer: undefined
        };
    },
    methods: {
        Login(callback) {
            this.login_show = true;
            this.callback = callback;
        },
        Login_cookie() {
            this.way_select = false;
            this.cookie_login = true;
        },
        confirm_cookie_login(callback){
            localStorage.setItem('cookie', this.input_cookie);
            ElNotification({
                title: 'Success',
                message: '登陆成功',
                type: 'success',
            });
            this.login_show = false;
            axios.post("http://localhost:3030/func", {
                target: "user_inf",
                data: {
                    cookie: localStorage.getItem("cookie")
                }
            }).then((res) => {
                localStorage['profile'] = JSON.stringify(res.data);
                if (typeof callback == "function") {
                    callback();
                }
            });
        },
        Login_qr(callback) {
            this.way_select = false;
            this.qr_login = true;
            axios.post(path + "func", {
                target: "generate_qr_code",
                data: {}
            }).then((response) => {
                this.qrimg = response.data.qrimg;
                this.key = response.data.key;
                this.timer = setInterval(() => {
                    axios.post(path + "func", {
                        target: "qr_check",
                        data: {
                            key: this.key
                        }
                    }).then((res) => {
                        let statusRes = res.data;
                        console.log(statusRes.code)
                        if (statusRes.code === 800) {
                            console.log("out_of_Date");
                            this.out_of_date = true;
                            clearInterval(this.timer);
                        }
                        if (statusRes.code === 802) {
                            if (this.scan_success == false) {
                                this.scan_success = true;
                            }
                        }
                        if (statusRes.code === 803) {
                            this.scan_success = false;
                            this.out_of_date = false;
                            clearInterval(this.timer);
                            localStorage.setItem('cookie', statusRes.cookie);
                            ElNotification({
                                title: 'Success',
                                message: '登陆成功',
                                type: 'success',
                            });
                            this.login_show = false;
                            axios.post("http://localhost:3030/func", {
                                target: "user_inf",
                                data: {
                                    cookie: localStorage.getItem("cookie")
                                }
                            }).then((res) => {
                                localStorage['profile'] = JSON.stringify(res.data);
                                if (typeof callback == "function") {
                                    callback();
                                }
                            });
                        }
                    });
                }, 1000);
            });
        },
        back() {
            this.way_select = true;
            this.qr_login = false;
            this.cookie_login = false;
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    },
    components: { ElButton }
}
</script>

<style scoped>
.drawer-container {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1000;
    backdrop-filter: blur(10px);
    transition: all 0.5s ease-in-out;
    background: rgba(158, 158, 158, 0.1);
}

.drawer-body {
    position: absolute;
    left: 50%;
    padding: 20px;
    width: 50%;
    height: 50%;
    border-radius: 5px;
    top: 40%;
    transform: translate(-50%, -50%);
    transition: 0.5s ease-in-out;
    background-color: white;
}

.drawer-show-enter-from,
.drawer-show-leave-to {
    background: rgba(255, 255, 255, 0);
    backdrop-filter: blur(0px);
}

.drawer-show-enter-from .drawer-body,
.drawer-show-leave-to .drawer-body {
    transform: translate(-50%, 100%);
}

.drawer-show-enter-to,
.drawer-show-leave-from {
    background: rgba(245, 245, 245, 0.1);
    backdrop-filter: blur(10px);
}

.drawer-show-enter-to .drawer-body,
.drawer-show-leave-from .drawer-body {
    transform: translate(-50%, -50%);
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.3);
}
</style>