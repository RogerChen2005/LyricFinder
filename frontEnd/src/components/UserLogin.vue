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
                <div style="width: 200px;height: 200px;margin: 0;position: relative;">
                    <div v-if="scan_success" class="mask">
                        <box-icon size="lg" name='check-circle' color='#409EFF'></box-icon>
                        <div>已扫描</div>
                    </div>
                    <div v-if="out_of_date" class="mask">
                        <box-icon size="lg" name='x-circle' color='#F56C6C'></box-icon>
                        <div>已过期</div>
                    </div>
                    <img :src="qrimg" />
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios';
import { ElNotification } from 'element-plus'
const path = "http://localhost:3030/"
export default {
    name: 'UserLogin',
    props: {
    },
    data() {
        return {
            login_show: false,
            scan_success: false,
            out_of_date: false,
            qrimg: "",
            key: ""
        }
    },
    methods: {
        Login(callback) {
            this.login_show = true;
            axios.post(path + "func", {
                target: "generate_qr_code",
                data: {}
            }).then(
                (response) => {
                    this.qrimg = response.data.qrimg;
                    this.key = response.data.key;
                    let timer = setInterval(() => {
                        axios.post(path + "func", {
                            target: "qr_check",
                            data: {
                                key: this.key
                            }
                        }).then((res) => {
                            let statusRes = res.data;
                            if (statusRes.code === 800) {
                                console.log("out_of_Date");
                                this.out_of_date = true;
                                clearInterval(timer);
                            }
                            if (statusRes.code === 802) {
                                if (this.scan_success == false) {
                                    this.scan_success = true;
                                }
                            }
                            if (statusRes.code === 803) {
                                this.scan_success = false;
                                this.out_of_date = false;
                                console.log("success");
                                clearInterval(timer);
                                console.log(statusRes);
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
                        })
                    }, 1000);
                }
            )
        }
    }
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