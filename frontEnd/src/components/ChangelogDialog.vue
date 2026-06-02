<template>
    <el-dialog v-model="visible" title="更新日志" width="500px" append-to-body :close-on-click-modal="false">
        <div class="changelog" v-html="content"></div>
        <template #footer>
            <el-button type="primary" @click="close">知道了</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import changelogMd from '@/md/CHANGELOG.md?raw'
import pkg from '../../package.json'

const CHANGELOG_KEY = 'changelog_version'
const CURRENT_VERSION = `v${pkg.version}`

const visible = ref(false)
const content = ref('')

onMounted(async () => {
    const cookie = localStorage.getItem('cookie')
    const seen = localStorage.getItem(CHANGELOG_KEY)
    if (cookie && seen !== CURRENT_VERSION) {
        content.value = await marked(changelogMd)
        visible.value = true
    }
})

function close() {
    localStorage.setItem(CHANGELOG_KEY, CURRENT_VERSION)
    visible.value = false
}
</script>

<style scoped>
.changelog {
    max-height: 400px;
    overflow-y: auto;
    line-height: 1.6;
    color: var(--text-color-secondary);
}

.changelog :deep(h1) {
    font-size: 20px;
    color: var(--text-color);
    margin-bottom: 12px;
}

.changelog :deep(h2) {
    font-size: 16px;
    color: var(--accent);
    margin: 16px 0 8px;
}

.changelog :deep(ul) {
    padding-left: 20px;
    margin: 0;
}

.changelog :deep(li) {
    margin-bottom: 4px;
}
</style>
