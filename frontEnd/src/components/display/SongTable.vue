<template>
    <el-table @row-contextmenu="handleRightClick" :data="list" style="width: 100%;">
        <el-table-column type="index" />
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="artists" label="歌手">
            <template #default="scope">
                <div v-for="artist in scope.row.artists" :key="artist.id">
                    <el-link @click="display_artist(artist)">{{ artist.name }}</el-link>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="album" label="专辑">
            <template #default="scope">
                <el-link @click="display_album(scope.row.album)">{{ scope.row.album.name }}</el-link>
            </template>
        </el-table-column>
        <el-table-column fixed="right">
            <template #default="scope">
                <div class="play-circle" @click="listen(list[scope.$index])">
                    <box-icon name="play-circle" size="20px" color="var(--text-color)"></box-icon>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <Teleport to="body">
        <CRMenu ref="menu" v-model:visible="display">
            <template #content>
                <CRMenuCell v-for="option in options" :key="option.name"
                    @click="option.handler(data); display = false;">
                    <template #icon><box-icon size="25px" color="var(--text-color)"
                            :name="option.icon"></box-icon></template>
                    {{ option.name }}
                </CRMenuCell>
            </template>
        </CRMenu>
    </Teleport>
</template>

<script>
import CRMenu from '../UI/CRMenu.vue'
import CRMenuCell from "../UI/CRMenuCell.vue"

export default {
    name: "SongMenu",
    props: {
        list: Array
    },
    components: {
        CRMenu, CRMenuCell
    },
    data() {
        return {
            display: false,
            options: [{
                name: "播放",
                icon: "play",
                handler: this.listen
            }, {
                name: "下一首播放",
                icon: "list-plus",
                handler: (data) => this.$store.state.player.next(data),
            }, {
                name: "下载",
                icon: "download",
                handler: (data) => this.$store.state.queue.add(data),
            }],
            data: {}
        }
    },
    methods: {
        open(x, y, data) {
            this.display = true;
            this.data = data;
            this.$refs.menu.handleOpen(x, y);
        },
        listen(data) {
            this.$store.state.player.listen(data)
        },
        display_album(item) {
            this.$router.push(`./album?id=${item.id}`);
        },
        display_artist(item) {
            this.$router.push(`./artist?id=${item.id}`);
        },
        handleRightClick(row, col, e) {
            e.preventDefault();
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            this.open(mouseX, mouseY, row);
        }
    }
}
</script>

<style scoped>
.play-circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    transition: .5s;
    cursor: pointer;
}

.play-circle:hover {
    background-color: var(--bg-color-solid-hover);
}
</style>