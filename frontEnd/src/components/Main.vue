<template>
  <MusicPlayer ref="player" id="player" />
  <UserLogin ref="login" />
  <el-container id="container">
    <el-header height="30px" id="header">
        <img id="icon" src="@/assets/icon.png">
        <div id='button-set'>
            <div onclick="window.electronAPI.hide()" class="button">
                <box-icon style="transform: scale(80%);" name='minus'></box-icon>
            </div>
            <div onclick="window.electronAPI.maximize()" class="button">
                <box-icon  style="transform: scale(60%);"
                name='rectangle'></box-icon>
            </div>
            <div onclick="window.electronAPI.close();" class="button" id="close">
                <box-icon name='x'></box-icon>
            </div>
        </div>
    </el-header>
    <el-container>
      <el-aside id="aside" width="130px">
      <el-menu id="menu" :default-active="current_tab" @select="onHandleSelect">
        <el-icon></el-icon><template #title>首页</template>
        <div id="logo">
          <img :src="require('@/assets/icon.png')" style="width: 45%;" />
        </div>
        <el-menu-item index="1">
          <el-icon><box-icon name="home"></box-icon></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><box-icon name="list-ul"></box-icon></el-icon>
          <template #title>歌单</template>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon>
            <el-badge :value="queue.length" :hidden="queue.length==0" class="item"><box-icon name="download"></box-icon></el-badge>
          </el-icon>
          <template #title>下载</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><box-icon name="search"></box-icon></el-icon>
          <template #title>搜索</template>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><box-icon name="wrench"></box-icon></el-icon>
          <template #title>工具</template>
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon><box-icon name="user"></box-icon></el-icon>
          <template #title>账户</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main id="main">
      <div class="page" v-if="current_tab == 1">
        <HomePage />
      </div>
      <div class="page" v-if="current_tab == 2">
        <SongList :trylisten="try_listen" :add_item="add_item"/>
      </div>
      <div class="page" v-if="current_tab == 3">
        <DownloadPage :queue="queue"/>
      </div>
      <div class="page" v-if="current_tab == 4">
        <SearchPage :trylisten="try_listen" :add_item="add_item" />
      </div>
      <div class="page" v-if="current_tab == 5">
        <ToolsPage />
      </div>
      <div class="page" v-if="current_tab == 6">
        <UserPage :login="Login" />
      </div>
    </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HomePage from './HomePage.vue'
import DownloadPage from './DownloadPage.vue'
import SongList from './SongList.vue'
import ToolsPage from './ToolsPage.vue'
import UserPage from './UserPage.vue'
import SearchPage from './SearchPage.vue'
import MusicPlayer from './MusicPlayer.vue'
import UserLogin from './UserLogin.vue'
import { ElNotification } from 'element-plus'

export default {
  name: 'MainPage',
  components: {
    HomePage, DownloadPage, SongList, ToolsPage, UserPage, SearchPage, MusicPlayer, UserLogin
  },
  data() {
    return {
      current_tab: 2,
      queue: []
    }
  },
  created() {
    let queue = localStorage.getItem("queue");
    queue == null ? this.queue = [] : this.queue = JSON.parse(queue);
    console.log(this.$route.fullPath);
  },
  beforeUnmount: function () {
    console.log(this.queue);
    localStorage['queue'] = JSON.stringify(this.queue);
  },
  methods: {
    onHandleSelect: function (index) {
      this.current_tab = index;
    },
    try_listen(data) {
      this.$refs.player.init(data);
    },
    add_item(args) {
      this.queue.push(args);
      ElNotification({
        title: 'Success',
        message: '添加成功',
        type: 'success',
      });
    },
    delete_item(index) {
      this.queue.splice(index, 1);
    },
    Login(callback) {
      this.$refs.login.Login(() => {
        if (typeof callback == "function") {
          callback();
        }
      });
    },
  },
}
</script>

<style>
@keyframes enter {
  0% {
    transform: translateY(300px);
    opacity: 0;
  }

  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}
#container{
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#main {
  overflow: hidden;
  padding: 0;
}

#menu {
  height: 100%;
}

#logo {
  font-size: 18px;
  padding-left: 0;
  margin-bottom: 20px;
  cursor: default;
}

#logo:hover {
  background: none;
}

.page {
  height: 100%;
  width: 100%;
  animation: enter ease-out .5s;
}

#header {
    background-color: #f8f8f8;
    padding: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-user-select: none;
    -webkit-app-region: drag;
}

#icon {
    margin-left: 5px;
    width: 18px;
    height: 18px;
    -webkit-app-region: no-drag;
}

#button-set {
    display: flex;
    flex-direction: row;
    align-items: center;
    -webkit-app-region: no-drag;
}

.button {
    padding-top: 3px;
    height: 30px;
    width: 50px;
    transition: .5s;
}
.button:hover{
    background-color: #e3e3e3;
}

#close:hover{
    background-color: #F56C6C;
}
</style>
