<template>
  <MusicPlayer ref="player" id="player" />
  <UserLogin ref="login" />
  <el-container id="container">
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
</template>

<script>
import HomePage from './components/HomePage.vue'
import DownloadPage from './components/DownloadPage.vue'
import SongList from './components/SongList.vue'
import ToolsPage from './components/ToolsPage.vue'
import UserPage from './components/UserPage.vue'
import SearchPage from './components/SearchPage.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import UserLogin from './components/UserLogin.vue'
import { ElNotification } from 'element-plus'

export default {
  name: 'App',
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
    queue == null ? this.queue = [] : this.queue = JSON.parse(queue)
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
    }
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#container {
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
</style>
