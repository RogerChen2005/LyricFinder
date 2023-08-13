<template>
  <div id="main">
    <h1 class="title">工具</h1>
    <el-card v-for="item in tools" :key="item.target" shadow="hover" style="margin-bottom: 10px;"
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
        <el-switch @change="update" v-model="settings.classify" active-color="#13ce66"></el-switch>
      </div>
      <div class="item">
        <div class="header">
          <div style="font-size: 20px;">翻译歌词</div>
          <div style="font-size: 14px;">开启后存储的歌词包括翻译歌词</div>
        </div>
        <el-switch @change="update" v-model="settings.tlyric" active-color="#13ce66"></el-switch>
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
          <div style="font-size: 20px;">保存目录</div>
          <div style="font-size: 14px;">选择下载文件的保存目录</div>
        </div>
        <el-input @change="update" v-model="settings.path" placeholder="请输入内容"></el-input>
        <el-button type="primary" style="margin-left: 10px;" v-on:click="select_folder">选择文件夹</el-button>
      </div>
    </div>
    <h1 class="title">关于</h1>
    <div style="padding-left: 2em;padding-right: 2em;">
      <el-row style="font-size: 25px;font-weight: 300;margin-bottom: 10px;">README.md</el-row>
      <div v-html="README"
        style="padding-left: 2em;padding-right: 2em;border: 1px solid rgb(177, 177, 177);border-radius: 10px;">
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  name: 'ToolsPage',
  props: {
  },
  data() {
    return {
      settings: {
        classify: false,
        path: "",
        mode: 0,
        tlyric: true
      },
      options: [{
        label: "歌手 - 歌名",
        value: 0
      }, {
        label: "歌名 - 歌手",
        value: 1
      }],
      tools: [{
        name: "自动为文件夹中歌曲匹配歌词",
        discription: "有几率匹配不准确",
        target: "FolderLyric"
      },
      {
        name: "自动为文件夹中歌曲匹配封面",
        discription: "如果存在封面会自动跳过",
        target: "FolderCover"
      }
      ]
    }
  },
  methods: {
    async select_folder() {
      this.settings.path = await window.electronAPI.filePicker();
      this.update();
      return;
    },
    update() {
      localStorage.setItem('settings', JSON.stringify(this.settings));
      ElMessage({
        message: '设置已更新',
        type: 'success',
      });
    },
    opentool(name){
      return window.electronAPI.openToolWin(name);
    }
  },
  created:function(){
    let settings = JSON.parse(localStorage.getItem('settings'));
    if(settings){
      this.settings = settings;
    }
  }
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
}

.header {
  min-width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: self-start;
}
</style>