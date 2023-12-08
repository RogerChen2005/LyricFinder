<template>
    <router-view id='body'></router-view>
    <MusicPlayer ref="player" id="player" />
</template>

<script>
import MusicPlayer from './components/MusicPlayer.vue'
import {Queue} from './js/queue.js'
const default_settings = {"mode":0,"lyric":true,"tlyric":true,"quality":"exhigh","level":"exhigh"};

export default {
    name: "App",
    components: {
        MusicPlayer,
    },
    methods: {
        trylisten(data) {
            this.$refs.player.init(data);
        },
        listen_all(queue){
            this.$refs.player.listen_all(queue);
        }
    },
    created() {
        this.$store.state.trylisten = this.trylisten;
        this.$store.state.listen_all = this.listen_all;
        this.$store.state.queue = new Queue();
        this.$store.state.classManager.init_darkmode();
        let settings = JSON.parse(localStorage.getItem("settings"));
        this.$store.state.settings = settings?settings:default_settings;
    }
}
</script>

<style>
@keyframes enter {
    0% {
        translate: 100px 0;
        opacity: 0;
        filter: blur(20px);
    }

    100% {
        translate: 0 0;
        opacity: 1;
        filter: blur(0px);
    }
}

.hide_text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

body{
    background-color: var(--bg-color);
    color: var(--text-color);
}

html {
  --bg-color: #f2f2f2;
  --text-color: #464646;
}

html.dark {
  --bg-color: #2a2a2a;
  --text-color: #c0c0c0;
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