<template>
  <el-card class="r-card" body-style="padding:10px;display: flex;
                    flex-direction: row;align-items: center" shadow="hover">
    <el-col :span="19">
      <el-row>
        <div class="hide_text" style="font-size: 20px;">自动为文件夹中歌曲匹配歌词</div>
      </el-row>
      <el-row>
        <div class="hide_text" style="font-size: 10px;">有几率匹配不准确</div>
      </el-row>
    </el-col>
    <el-col :span="4">
      <el-button v-on:click="find_lyric" type="primary">开始</el-button>
    </el-col>
  </el-card>
  <el-card class="r-card" body-style="padding:10px;display: flex;
                    flex-direction: row;align-items: center" shadow="hover">
    <el-col :span="19">
      <el-row>
        <div class="hide_text" style="font-size: 20px;">自动为文件夹中歌曲添加封面</div>
      </el-row>
      <el-row>
        <div class="hide_text" style="font-size: 10px;">如果存在封面会自动跳过</div>
      </el-row>
    </el-col>
    <el-col :span="4">
      <el-button v-on:click="find_cover" type="primary">开始</el-button>
    </el-col>
  </el-card>
  <div id="settings">
    <h1 class="title">下载</h1>
    <div style="padding-left: 2em;padding-right: 2em;">
      <el-row class="item">
        <el-col :span="10">
          <el-row style="font-size: 20px;font-weight: 300;">分文件夹存放</el-row>
          <el-row style="font-size: 10px;">开启后可将歌词，封面，歌曲存放至不同的子文件夹</el-row>
        </el-col>
        <el-col style="padding-top: 10px;" :span="14">
          <el-switch v-model="settings.classify" active-color="#13ce66"></el-switch>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="6">
          <el-row style="font-size: 20px;font-weight: 300;">保存目录</el-row>
          <el-row style="font-size: 10px;">选择下载文件的保存目录</el-row>
        </el-col>
        <el-col style="margin-right: 10px;" :span="14">
          <el-input v-model="settings.download_path" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="2" style="overflow:visible;">
          <el-button type="primary" v-on:click="select_folder">选择文件夹</el-button>
          <input type="file" @change="selectFolder($event)" webkitdirectory />
        </el-col>
      </el-row>
    </div>
    <h1 class="title">关于本软件</h1>
    <div style="padding-left: 2em;padding-right: 2em;">
      <el-row style="font-size: 25px;font-weight: 300;margin-bottom: 10px;">README.md</el-row>
      <div v-html="README"
        style="padding-left: 2em;padding-right: 2em;border: 1px solid rgb(177, 177, 177);border-radius: 10px;">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ToolsPage',
  props: {
  },
  data() {
    return {
      settings: {
        classify: false,
      }
    }
  },
  methods: {
    selectFolder(e) {
      console.log(1);
      var files = e.target.files;
      console.log(files);
    },
    async select_folder(){
      const dirhandle= await window.showDirectoryPicker();
      console.log(file);
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

.r-card {
  border-radius: 10px;
  padding: 0;
  margin-bottom: 10px;
}

#settings {
  text-align: left;
}

#settings .item {
  margin-bottom: 15px;
}

#settings .item:last-child {
  margin-bottom: 0;
}

#settings .title {
  font-size: 25px;
}</style>