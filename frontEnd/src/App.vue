<template>
    <router-view id='body'></router-view>
</template>

<script>
import { Queue } from './js/queue.js'
import { _data } from './js/data_init.js'
const default_settings = { "mode": 0, "lyric": true, "tlyric": true, "quality": "exhigh", "level": "exhigh" };

export default {
    name: "App",
    methods: {
    },
    created() {
        let cookie = localStorage.getItem('cookie');
        this.$store.state.classManager.init_darkmode();
        this.$store.state.queue = new Queue();
        this.$store.state.data = new _data()
        let settings = JSON.parse(localStorage.getItem("settings"));
        this.$store.state.settings = settings ? settings : default_settings;
        if (!cookie) {
            this.$router.push('/login')
        }
    }
}
</script>

<style>
@keyframes enter {
    0% {
        translate: 100px 0;
        opacity: 0;
    }

    100% {
        translate: 0 0;
        opacity: 1;
    }
}

.hide_text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    --el-bg-color: transparent;
    --el-fill-color-blank: transparent;
    --el-mask-color: #fbfbfbae;
}

html.dark body {
    --el-mask-color: #2a2a2ab8;
}

html {
    --bg-color: #fbfbfb;
    --text-color: #464646;
    --bd-color: #bbbbbb99;
}

html.dark {
    --bg-color: #2a2a2a;
    --text-color: #c0c0c0;
    --bd-color: #7f7f7f7c;
    --el-bg-color: transparent;
}

.rowbox {
    display: flex;
    flex-direction: column;
}

.colbox {
    display: flex;
    flex-direction: row;
}

.container {
    animation: enter ease-out .5s backwards;
    height: 100%;
    width: 100%;
}
</style>

<style scoped>
#body {
    width: 100%;
    height: 100%;
}
</style>