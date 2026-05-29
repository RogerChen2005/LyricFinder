<template>
    <el-container id="main_content" style="padding: 24px 28px;" class="container">
        <el-header height="auto" style="margin-bottom: 20px;">
            <div style="font-size: 20px; font-weight: 600; color: var(--text-color);">下载管理</div>
            <div style="font-size: 13px; color: var(--text-color-secondary); margin-top: 4px;">管理你的下载队列</div>
        </el-header>
        <el-main style="padding: 0;">
            <section class="download-section">
                <div class="section-header">
                    <div class="section-title">下载队列</div>
                    <el-tag size="small" type="info">{{ queue.length }}</el-tag>
                </div>
                <div class="download-table-wrapper">
                    <el-table :data="queue" style="width: 100%;" empty-text="暂无待下载任务" :header-cell-style="tableHeaderStyle">
                        <el-table-column prop="title" label="名称" min-width="200" />
                        <el-table-column prop="artists" label="歌手" min-width="120" />
                        <el-table-column prop="album" label="专辑" min-width="120" />
                        <el-table-column fixed="right" label="状态" width="280">
                            <template #default="scope">
                                <div v-if="scope.row.status === 0" class="status-row">
                                    <span>等待下载...</span>
                                    <el-button link type="danger" size="small" @click="removeRow(scope.$index)">移除</el-button>
                                </div>
                                <div v-else-if="scope.row.status === 1" class="status-row">
                                    <span>等待服务器...</span>
                                </div>
                                <div v-else class="progress-row">
                                    <el-progress :percentage="scope.row.progress" :stroke-width="6" :show-text="false" />
                                    <span>{{ scope.row.progress }}%</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </section>

            <section class="download-section completed-section">
                <div class="section-header">
                    <div class="section-title">已完成</div>
                    <el-tag size="small" type="success">{{ completedQueue.length }}</el-tag>
                </div>
                <div class="download-table-wrapper">
                    <el-table :data="completedQueue" style="width: 100%;" empty-text="暂无已完成任务" :header-cell-style="tableHeaderStyle">
                        <el-table-column prop="title" label="名称" min-width="200" />
                        <el-table-column prop="artists" label="歌手" min-width="120" />
                        <el-table-column prop="album" label="专辑" min-width="120" />
                        <el-table-column fixed="right" label="状态" width="160">
                            <template #default>
                                <el-tag type="success" size="small">已完成</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </section>
        </el-main>
        <el-footer height="auto" style="margin-top: 20px; padding: 0;">
            <el-button v-on:click="download" type="primary">
                <box-icon name="download" color="#fff" style="margin-right: 6px;"></box-icon>
                开始下载
            </el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

const store = useAppStore()
const queue = computed(() => store.queue?.items ?? [])
const completedQueue = computed(() => store.queue?.completedItems ?? [])
const tableHeaderStyle = {
    background: 'var(--bg-color)',
    color: 'var(--text-color-secondary)',
    fontWeight: '500',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
}

function removeRow(index: number) {
    store.queue?.remove(index)
}

function download() {
    store.queue?.downloadAll()
}
</script>

<style scoped>
#main_content {
    text-align: left;
    height: 100%;
}

.download-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.completed-section {
    margin-top: 24px;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-title {
    color: var(--text-color);
    font-size: 15px;
    font-weight: 600;
}

.download-table-wrapper {
    border: 1px solid var(--bd-color);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.status-row,
.progress-row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-color-secondary);
    font-size: 13px;
}

.progress-row .el-progress {
    width: 80%;
    min-width: 120px;
}
</style>
