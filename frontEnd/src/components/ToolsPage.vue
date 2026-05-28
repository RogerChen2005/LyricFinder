<template>
  <div id="main" class="container">
    <h1 class="title">工具</h1>
    <el-card v-for="item in tools" :key="item.target" shadow="hover" style="margin-bottom: 10px;width: calc(100% - 30px);"
      body-style="padding:10px">
      <div class="r-card">
        <div style="display: flex;flex-direction: column;align-items: self-start;">
          <div class="hide_text" style="font-size: 20px;">{{ item.name }}</div>
          <div class="hide_text" style="font-size: 14px;">{{ item.discription }}</div>
        </div>
        <el-button v-on:click="opentool(item.target)" type="primary">开始</el-button>
      </div>
    </el-card>

    <h1 class="title">设置</h1>
    <div style="padding-left: 2em;padding-right: 2em;">
      <div class="item">
        <div class="header">
          <div style="font-size: 20px;">分文件夹存放</div>
          <div style="font-size: 14px;">开启后可将歌词，封面，歌曲存放至不同的子文件夹</div>
        </div>
        <el-switch disabled @change="update" v-model="settings.classify" active-color="#13ce66"></el-switch>
      </div>
      <div class="item">
        <div class="header">
          <div style="font-size: 20px;">命名方式</div>
          <div style="font-size: 14px;">调整命名顺序</div>
        </div>
        <el-select @change="update" v-model="settings.mode" placeholder="选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="item">
        <div class="header">
          <div style="font-size: 20px;">播放质量</div>
          <div style="font-size: 14px;">选择播放时的音频质量</div>
        </div>
        <el-select v-model="settings.quality" placeholder="请选择音质" @change="update">
          <el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <div class="header">
          <div style="font-size: 20px;">下载质量</div>
          <div style="font-size: 14px;">选择播放时的音频质量</div>
        </div>
        <el-select v-model="settings.level" placeholder="请选择音质" @change="update">
          <el-option v-for="item in quality" :key="item.value" :label="item.label" :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <div class="header">
          <div style="font-size: 20px;">歌词下载</div>
          <div style="font-size: 14px;">是否下载歌词</div>
        </div>
        <el-switch @change="update" v-model="settings.lyric" active-color="#13ce66"></el-switch>
      </div>
      <div v-if="settings.lyric" class="item">
        <div class="header">
          <div style="font-size: 20px;">翻译歌词</div>
          <div style="font-size: 14px;">开启后存储的歌词包括翻译歌词</div>
        </div>
        <el-switch @change="update" v-model="settings.tlyric" active-color="#13ce66"></el-switch>
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
  { name: '自动为文件夹中歌曲匹配歌词', discription: '有几率匹配不准确', target: 'FolderLyric' },
  { name: '自动为文件夹中歌曲匹配封面', discription: '如果存在封面会自动跳过', target: 'FolderCover' }
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
.hide_text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#main .item {
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 40px;
  align-items: center;
}

#main .item:last-child {
  margin-bottom: 0;
}

#main .title {
  font-size: 25px;
}

#main {
  padding: 20px;
  text-align: left;
  height: 100%;
  overflow: auto;
}

.r-card {
  border-radius: 10px;
  padding: 0;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header {
  min-width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: self-start;
}
</style>
