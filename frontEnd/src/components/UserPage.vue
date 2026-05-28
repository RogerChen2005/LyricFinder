<template>
    <div id="main_content" class="container">
        <div v-if="!isLogin" class="empty-state">
            <el-empty description="未登录" />
            <el-button type="primary" @click="router.push('/login')">登录</el-button>
        </div>
        <div v-if="isLogin" id="user-page">
            <div id="op">
                <el-button @click="user_inf" type="primary" plain>
                    <box-icon name='refresh' color="var(--accent)"></box-icon>
                    <span style="margin-left: 6px;">刷新</span>
                </el-button>
                <el-popconfirm @confirm="exit" title="确认退出登录？">
                    <template #reference>
                        <el-button type="danger" plain>
                            <box-icon name='exit' color="var(--danger)"></box-icon>
                            <span style="margin-left: 6px;">退出</span>
                        </el-button>
                    </template>
                </el-popconfirm>
            </div>
            <div id="bg-wrapper">
                <img id="bg" :src="bgurl">
                <div id="mask"></div>
            </div>
            <div id="profile-info">
                <el-avatar id="av" :size="120">
                    <img :src="avurl" />
                </el-avatar>
                <div id="name">{{ name }} <img v-if="isvip" style="width: 40px; vertical-align: middle;" :src="vipImg"></div>
                <div id="sg">{{ sig }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useAppStore } from '@/stores'
import vipImg from '@/assets/vip.png'

const store = useAppStore()
const router = useRouter()

const isLogin = ref(false)
const name = ref('')
const bgurl = ref('')
const avurl = ref('')
const sig = ref('')
const isvip = ref(false)

function user_inf() {
    store.data!.update('profile', (data) => {
        ElNotification({ title: 'Success', message: '刷新成功', type: 'success' })
        refresh(data.profile as Record<string, unknown>)
    }, (err) => {
        console.log(err)
        ElNotification({ title: 'Error', message: '刷新失败', type: 'error' })
        exit()
    })
}

function refresh(profile: Record<string, unknown>) {
    isLogin.value = true
    name.value = profile['nickname'] as string
    bgurl.value = profile['backgroundUrl'] as string
    avurl.value = profile['avatarUrl'] as string
    sig.value = profile['signature'] as string
    isvip.value = profile['isvip'] as boolean
}

function exit() {
    store.data!.remove_all()
    localStorage.removeItem('cookie')
    isLogin.value = false
    router.push('/login')
}

store.data!.gets('profile', (data) => {
    refresh(data.profile as Record<string, unknown>)
}, (err) => {
    console.log(err)
    ElNotification({ title: 'Error', message: '刷新失败', type: 'error' })
    exit()
})
</script>

<style scoped>
#main_content {
    text-align: left;
    padding: 0;
    height: 100%;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

#user-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

#bg-wrapper {
    position: relative;
    width: 100%;
    height: 280px;
    overflow: hidden;
    flex-shrink: 0;
}

#bg {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    object-fit: cover;
}

#mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, var(--bg-color) 100%);
}

#profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -60px;
    position: relative;
    z-index: 3;
    padding-bottom: 40px;
}

#av {
    border: 4px solid var(--bg-color-solid);
    box-shadow: var(--shadow-lg);
}

#name {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-color);
    margin-top: 16px;
    letter-spacing: -0.3px;
}

#sg {
    margin-top: 8px;
    font-size: 14px;
    color: var(--text-color-secondary);
}

#op {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    display: flex;
    gap: 8px;
}
</style>
