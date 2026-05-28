<template>
  <div id="main" class="container">
    <div class="page-header">
      <h1 class="title">工具</h1>
      <p class="subtitle">批量处理工具与应用设置</p>
    </div>

    <div class="tool-grid">
      <div v-for="item in tools" :key="item.target" class="tool-card" @click="opentool(item.target)">
        <div class="tool-info">
          <div class="tool-name">{{ item.name }}</div>
          <div class="tool-desc">{{ item.discription }}</div>
        </div>
        <div class="tool-arrow">
          <box-icon name="right-arrow-alt" color="var(--text-color-tertiary)"></box-icon>
        </div>
      </div>
    </div>

    <div class="section-header">
      <h2 class="title">设置</h2>
    </div>

    <div class="settings-list">
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">分文件夹存放</div>
          <div class="setting-desc">开启后可将歌词、封面、歌曲存放至不同的子文件夹</div>
        </div>
        <el-switch disabled @change="update" v-model="settings.classify" />
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">命名方式</div>
          <div class="setting-desc">调整文件命名顺序</div>
        </div>
        <el-select @change="update" v-model="settings.mode" placeholder="选择" style="width: 180px;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">播放质量</div>
          <div class="setting-desc">选择播放时的音频质量</div>
        </div>
        <el-select v-model="settings.quality" placeholder="请选择音质" @change="update" style="width: 180px;">
          <el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">下载质量</div>
          <div class="setting-desc">选择下载时的音频质量</div>
        </div>
        <el-select v-model="settings.level" placeholder="请选择音质" @change="update" style="width: 180px;">
          <el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">歌词下载</div>
          <div class="setting-desc">是否在下载时同时下载歌词</div>
        </div>
        <el-switch @change="update" v-model="settings.lyric" />
      </div>
      <div v-if="settings.lyric" class="setting-item">
        <div class="setting-info">
          <div class="setting-name">翻译歌词</div>
          <div class="setting-desc">开启后存储的歌词将包含翻译</div>
        </div>
        <el-switch @change="update" v-model="settings.tlyric" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores'
import type { AppSettings } from '@/stores'

const store = useAppStore()

const settings = reactive<AppSettings & { classify?: boolean }>({ ...store.settings })

const options = [
  { label: '歌手 - 歌名', value: 0 },
  { label: '歌名 - 歌手', value: 1 }
]

const tools = [
  { name: '自动匹配歌词', discription: '为文件夹中的歌曲自动匹配歌词，有几率匹配不准确', target: 'FolderLyric' },
  { name: '自动匹配封面', discription: '为文件夹中的歌曲自动匹配封面，已存在封面会跳过', target: 'FolderCover' }
]

const quality = [
  { label: '标准', value: 'standard' },
  { label: '极高', value: 'exhigh' },
  { label: '无损', value: 'lossless' },
  { label: 'Hi-Res', value: 'hires' },
  { label: '高清环绕声', value: 'jyeffect' },
  { label: '沉浸环绕声', value: 'sky' },
  { label: '超清母带', value: 'jymaster' }
]

function update() {
  store.settings = { ...settings }
  localStorage.setItem('settings', JSON.stringify(settings))
  ElMessage({ message: '设置已更新', type: 'success' })
}

function opentool(name: string) {
  window.open(`/#/tools/${name}`, '_blank', 'width=800,height=900,left=400,popup=yes')
}

const saved = localStorage.getItem('settings')
if (saved) {
  Object.assign(settings, JSON.parse(saved))
}
</script>

<style scoped>
#main {
  padding: 32px 36px;
  text-align: left;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 28px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: var(--text-color-secondary);
  margin: 4px 0 0;
}

.section-header {
  margin: 36px 0 16px;
}

.tool-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tool-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-color-solid);
  border: 1px solid var(--bd-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tool-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.tool-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
}

.tool-desc {
  font-size: 13px;
  color: var(--text-color-secondary);
}

.tool-arrow {
  flex-shrink: 0;
  margin-left: 16px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--bd-color);
  border: 1px solid var(--bd-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.setting-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-color-solid);
  transition: background var(--transition-fast);
}

.setting-item:hover {
  background: var(--bg-color-solid-hover);
}

.setting-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 2px;
}

.setting-desc {
  font-size: 12px;
  color: var(--text-color-secondary);
}
</style>
