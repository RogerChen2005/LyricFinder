<template>
  <div id="shell">
    <aside id="sidebar">
      <div id="logo">
        <img :src="icon" />
        <span>LyricFinder</span>
      </div>
      <nav id="nav">
        <a v-for="(item, i) in navItems" :key="item.path"
          :class="{ active: current_tab === i }"
          @click="onHandleSelect(i)">
          <box-icon :name="item.icon" :type="item.type || 'regular'" :color="current_tab === i ? 'var(--accent)' : 'var(--text-color-secondary)'" />
          <span>{{ item.label }}</span>
          <el-badge v-if="item.badge" :value="store.queue?.length" :hidden="store.queue?.length === 0" />
        </a>
      </nav>
    </aside>
    <div id="content-area">
      <header id="search-header">
        <div id="search-box">
          <box-icon name="search" color="var(--text-color-tertiary)" size="18px" />
          <input v-model="search_text" @keydown.enter="search" placeholder="搜索歌曲、歌手、专辑、歌单，或粘贴网易云链接..." />
        </div>
      </header>
      <main id="main">
        <router-view></router-view>
      </main>
    </div>
  </div>
  <MusicPlayer ref="player" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import MusicPlayer from './MusicPlayer.vue'
import icon from '@/assets/icon.png'

const navItems = [
  { path: '/', icon: 'home', label: '发现', type: '' },
  { path: '/list', icon: 'list-ul', label: '歌单', type: '' },
  { path: '/download', icon: 'download', label: '下载', type: '', badge: true },
  { path: '/tools', icon: 'wrench', label: '工具', type: '' },
  { path: '/user', icon: 'user', label: '账户', type: '' },
  { path: '/about', icon: 'info-circle', label: '关于', type: '' },
]

const store = useAppStore()
const router = useRouter()

const current_tab = ref(0)
const search_text = ref('')

function query_finder(key: string, query: string): string | undefined {
  const queries = query.split('&')
  for (const i of queries) {
    const temp = i.split('=')
    if (temp[0] === key) return temp[1]
  }
}

function search() {
  if (search_text.value.startsWith('https://y.music.163.com') || search_text.value.startsWith('http://music.163.com')) {
    const start = search_text.value.lastIndexOf('/')
    const mid = search_text.value.indexOf('?')
    const path = search_text.value.substring(start + 1, mid)
    const id = query_finder('id', search_text.value.substring(mid + 1))
    switch (path) {
      case 'playlist':
        router.push(`/playlist?id=${id}`)
        return
      case 'album':
        router.push(`/album?id=${id}`)
        return
      case 'artist':
        router.push(`/artist?id=${id}`)
        return
    }
    const s = search_text.value.split('/')
    if (s[3] === 'album') {
      router.push(`/album?id=${s[4]}`)
      return
    }
  }
  router.push(`/search/all?key=${search_text.value}`)
}

function onHandleSelect(index: number) {
  current_tab.value = index
  router.push(navItems[index].path)
}
</script>

<style>
/* Global shared styles */
.footer {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}

.songlist_card {
  cursor: pointer;
  width: 170px;
  border: 1px solid var(--bd-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
  background: var(--bg-color-solid);
}

.songlist_card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-subtle);
}

.page {
  height: 100%;
  width: 100%;
  animation: enter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.button {
  padding-top: 3px;
  height: 30px;
  width: 50px;
  transition: var(--transition-fast);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
#shell {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
}

/* Sidebar */
#sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  background: var(--bg-color-solid);
  border-right: 1px solid var(--bd-color);
  box-sizing: border-box;
}

#logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-bottom: 28px;
}

#logo img {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
}

#logo span {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.3px;
}

/* Navigation */
#nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

#nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary);
  transition: all var(--transition-fast);
  text-decoration: none;
  position: relative;
}

#nav a:hover {
  background: var(--bg-color-solid-hover);
  color: var(--text-color);
}

#nav a.active {
  background: var(--accent-subtle);
  color: var(--accent);
  font-weight: 600;
}

#nav a .el-badge {
  margin-left: auto;
}

/* Content area */
#content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

/* Header */
#search-header {
  height: var(--header-height);
  min-height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 28px;
  background: var(--bg-color-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--bd-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

#search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 560px;
  padding: 8px 16px;
  background: var(--bg-color);
  border: 1px solid var(--bd-color);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

#search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-subtle);
}

#search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-color);
  font-family: inherit;
}

#search-box input::placeholder {
  color: var(--text-color-tertiary);
}

/* Main */
#main {
  flex: 1;
  overflow: hidden;
  padding: 0;
}
</style>
