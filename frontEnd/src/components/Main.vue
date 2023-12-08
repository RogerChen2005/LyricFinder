<template>
  <el-container id="container">
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
              <el-badge :value="queue.length" :hidden="queue.length == 0" class="item"><box-icon
                  name="download"></box-icon></el-badge>
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

const tabs = ['/', '/list', '/download', '/search', '/tools', '/user'];

export default {
  name: 'MainPage',
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
      this.$router.push(tabs[index - 1]);
    },
  },
}
</script>

<style>
#container {
  width: 100%;
  height: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

#main {
  overflow: hidden;
  padding: 0;
}

#menu {
  text-align: center;
  height: 100%;
  background-color: var(--bg-color);
  color: var(--text-color);
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

.button:hover {
  background-color: #e3e3e3;
}

#close:hover {
  background-color: #F56C6C;
}
</style>
