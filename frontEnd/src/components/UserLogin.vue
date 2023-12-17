<template>
    <div style="position: relative;background-color: var(--bg-color);" class="container">
        <div class="drawer-container rowbox">
            <div class="colbox" style="align-items: center;justify-content: center;">
                <img :src="require('@/assets/icon.png')" style="height: 80px;" />
                <div style="font-size: 26px;margin-left: 20px;text-align: left;">
                    Lyric<br />
                    <div style="font-size: 39px;">Finder</div>
                </div>
            </div>
            <div style="align-items: center;align-items: center;justify-content: center;" class="drawer-body rowbox">
                <div v-if="qr_login" style="width: 200px;height: 200px;margin: 0;position: relative;text-align: center;">
                    <div v-if="scan_success" class="mask">
                        <box-icon size="lg" name='check-circle' color='#409EFF'></box-icon>
                        <div>已扫描</div>
                    </div>
                    <div v-if="out_of_date" class="mask">
                        <box-icon size="lg" name='x-circle' color='#F56C6C'></box-icon>
                        <div>已过期</div>
                    </div>
                    <img :src="qrimg" />
                    <div>使用网易云 APP 扫码登录</div>
                    <el-link type="primary" @click="Login_cookie">使用cookie登录(不推荐)</el-link>
                </div>
                <div v-if="cookie_login" style="width: 80%;">
                    <div style="margin-bottom: 20px;">
                        <el-input v-model="input_cookie" type="textarea" placeholder="请输入cookie">
                        </el-input>
                    </div>
                    <div style="display: flex;justify-content: space-around;">
                        <el-button v-on:click="confirm_cookie_login(callback)" type="primary"
                            style="margin-left: 20px;">登录</el-button>
                        <el-button v-on:click="Login_qr" type="danger" style="margin-left: 20px;">返回</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ElNotification } from 'element-plus'
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
            timer: undefined
        };
    },
    methods: {
        Login_cookie() {
            this.cookie_login = true;
            this.qr_login = false;
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        confirm_cookie_login() {
            axios.post("/func", {
                target: "user_inf",
                data: {
                    cookie: this.input_cookie
                }
            }).then((res) => {
                if (res.status == 200) {
                    ElNotification({
                        title: 'Success',
                        message: '登陆成功',
                        type: 'success',
                    });
                    localStorage.setItem('cookie', this.input_cookie);
                    localStorage.setItem('profile', JSON.stringify(res.data));
                    this.$router.push("/user");
                }
                else ElNotification({
                    title: 'Error',
                    message: '登陆失败',
                    type: 'error',
                });
            });
        },
        Login_qr() {
            this.cookie_login = false;
            this.qr_login = true;
            axios.post("/func", {
                target: "generate_qr_code",
                data: {}
            }).then((response) => {
                this.qrimg = response.data.qrimg;
                this.key = response.data.key;
                this.timer = setInterval(() => {
                    axios.post("/func", {
                        target: "qr_check",
                        data: {
                            key: this.key
                        }
                    }).then((res) => {
                        let statusRes = res.data;
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
                            axios.post("/func", {
                                target: "user_inf",
                                data: {
                                    cookie: statusRes.cookie
                                }
                            }).then((res) => {
                                localStorage['profile'] = JSON.stringify(res.data);
                                localStorage.setItem('cookie', statusRes.cookie);
                                ElNotification({
                                    title: 'Success',
                                    message: '登陆成功',
                                    type: 'success',
                                });
                                this.$router.push("/user");
                            });
                        }
                    });
                }, 1000);
            });
        },
    },
    created() {
        setTimeout(() => this.Login_qr(), 0);
    }
}
</script>

<style scoped>
@keyframes enter-from-bottom {
    0% {
        transform: translate(-100%, -50%);
        background: rgba(158, 158, 158, 0.1);
    }

    100% {
        transform: translate(-50%, -50%);
    }
}

.drawer-container {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 700px;
    height: 500px;
    /* backdrop-filter: blur(10px); */
    transition: all 0.5s ease-in-out;
    text-align: center;
    background-color: var(--bg-color);
}

.drawer-body {
    padding: 20px;
    margin: 20px;
    width: 100%;
    flex-grow: 1;
    border-radius: 5px;
    transition: 0.5s ease-in-out;
    box-shadow: var(--el-box-shadow);
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