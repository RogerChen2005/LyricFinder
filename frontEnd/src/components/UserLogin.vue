<template>
    <div style="position: relative;background-color: var(--bg-color);" class="container">
        <div class="drawer-container rowbox">
            <div class="colbox" style="align-items: center;justify-content: center;">
                <img :src="iconImg" style="height: 80px;" />
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
                        <el-button v-on:click="confirm_cookie_login()" type="primary"
                            style="margin-left: 20px;">登录</el-button>
                        <el-button v-on:click="Login_qr" type="danger" style="margin-left: 20px;">返回</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import axios from '@/utils/request'
import iconImg from '@/assets/icon.png'

const router = useRouter()

const scan_success = ref(false)
const out_of_date = ref(false)
const qrimg = ref('')
const key = ref('')
const qr_login = ref(false)
const cookie_login = ref(false)
const input_cookie = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function Login_cookie() {
    cookie_login.value = true
    qr_login.value = false
    if (timer) clearInterval(timer)
}

function confirm_cookie_login() {
    axios.post('/api/auth/user', { cookie: input_cookie.value }).then((res) => {
        if (res.status === 200) {
            ElNotification({ title: 'Success', message: '登陆成功', type: 'success' })
            localStorage.setItem('cookie', input_cookie.value)
            localStorage.setItem('profile', JSON.stringify(res.data))
            router.push('/user')
        } else {
            ElNotification({ title: 'Error', message: '登陆失败', type: 'error' })
        }
    })
}

function Login_qr() {
    cookie_login.value = false
    qr_login.value = true
    axios.post('/api/auth/qr', {}).then((response) => {
        qrimg.value = response.data.qrimg
        key.value = response.data.key
        timer = setInterval(() => {
            axios.post('/api/auth/qr/check', { key: key.value }).then((res) => {
                const statusRes = res.data
                if (statusRes.code === 800) {
                    out_of_date.value = true
                    if (timer) clearInterval(timer)
                }
                if (statusRes.code === 802) {
                    if (!scan_success.value) scan_success.value = true
                }
                if (statusRes.code === 803) {
                    scan_success.value = false
                    out_of_date.value = false
                    if (timer) clearInterval(timer)
                    ElNotification({ title: 'Success', message: '登陆成功', type: 'success' })
                    localStorage.setItem('cookie', statusRes.cookie)
                    router.push('/user')
                }
            })
        }, 1000)
    })
}

setTimeout(() => Login_qr(), 0)
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
