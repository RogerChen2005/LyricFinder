<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-header">
                <img :src="iconImg" class="login-logo" />
                <div class="login-brand">
                    <span class="brand-sub">Lyric</span>
                    <span class="brand-main">Finder</span>
                </div>
            </div>
            <div class="login-body">
                <div v-if="qr_login" class="qr-section">
                    <div class="qr-wrapper">
                        <div v-if="scan_success" class="qr-overlay">
                            <box-icon size="lg" name='check-circle' color='var(--success)'></box-icon>
                            <div>已扫描</div>
                        </div>
                        <div v-if="out_of_date" class="qr-overlay">
                            <box-icon size="lg" name='x-circle' color='var(--danger)'></box-icon>
                            <div>已过期</div>
                        </div>
                        <img :src="qrimg" class="qr-img" />
                    </div>
                    <div class="qr-hint">使用网易云 APP 扫码登录</div>
                    <el-link type="primary" @click="Login_cookie" class="alt-login">使用 cookie 登录</el-link>
                </div>
                <div v-if="cookie_login" class="cookie-section">
                    <el-input v-model="input_cookie" type="textarea" :rows="4" placeholder="请输入 cookie" />
                    <div class="cookie-actions">
                        <el-button v-on:click="confirm_cookie_login()" type="primary">登录</el-button>
                        <el-button v-on:click="Login_qr" plain>返回扫码</el-button>
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
.login-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-color);
}

.login-card {
    width: 400px;
    background: var(--bg-color-solid);
    border: 1px solid var(--bd-color);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
    from { translate: 0 30px; opacity: 0; }
    to { translate: 0 0; opacity: 1; }
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 36px 32px 24px;
    border-bottom: 1px solid var(--bd-color);
}

.login-logo {
    height: 56px;
    border-radius: var(--radius-sm);
}

.login-brand {
    text-align: left;
}

.brand-sub {
    display: block;
    font-size: 16px;
    font-weight: 400;
    color: var(--text-color-secondary);
    line-height: 1.1;
}

.brand-main {
    display: block;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.5px;
}

.login-body {
    padding: 32px;
}

.qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.qr-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--bd-color);
}

.qr-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.qr-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(12px);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1;
    background: var(--bg-color-glass);
}

.qr-hint {
    font-size: 13px;
    color: var(--text-color-secondary);
}

.alt-login {
    font-size: 13px;
}

.cookie-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cookie-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
}
</style>
