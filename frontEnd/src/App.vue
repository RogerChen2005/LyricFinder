<template>
    <router-view id='body'></router-view>
</template>

<script setup lang="ts">
import { useAppStore } from './stores'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

store.init()

const cookie = localStorage.getItem('cookie')
if (!cookie) {
    router.push('/login')
}
</script>

<style>
@keyframes enter {
    0% {
        translate: 40px 0;
        opacity: 0;
    }
    100% {
        translate: 0 0;
        opacity: 1;
    }
}

@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slide-up {
    from { translate: 0 20px; opacity: 0; }
    to { translate: 0 0; opacity: 1; }
}

* {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-color) transparent;
}

*::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

*::-webkit-scrollbar-track {
    background: transparent;
}

*::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 3px;
}

*::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-hover);
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
    --el-mask-color: rgba(250, 250, 252, 0.72);
    --el-border-color: var(--bd-color);
    --el-border-color-light: var(--bd-color);
    --el-text-color-primary: var(--text-color);
    --el-text-color-regular: var(--text-color);
    --el-text-color-secondary: var(--text-color-secondary);
    --el-font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    transition: background-color 0.3s, color 0.3s;
}

html.dark body {
    --el-mask-color: rgba(18, 18, 24, 0.72);
}

html {
    /* Light palette — warm off-white with indigo accent */
    --bg-color: #f8f8fa;
    --bg-color-solid: #ffffff;
    --bg-color-elevated: #ffffff;
    --bg-color-solid-hover: #f0f0f4;
    --bg-color-glass: rgba(255, 255, 255, 0.72);
    --text-color: #1a1a2e;
    --text-color-secondary: #6b6b80;
    --text-color-tertiary: #9d9db0;
    --text-color-light: #ffffff;
    --bd-color: rgba(0, 0, 0, 0.06);
    --bd-color-strong: rgba(0, 0, 0, 0.12);
    --accent: #6366f1;
    --accent-light: #818cf8;
    --accent-subtle: rgba(99, 102, 241, 0.08);
    --accent-hover: #4f46e5;
    --success: #22c55e;
    --danger: #ef4444;
    --danger-subtle: rgba(239, 68, 68, 0.08);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03);
    --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
    --shadow-float: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --radius-full: 9999px;
    --sidebar-width: 220px;
    --header-height: 64px;
    --player-height: 80px;
    --scrollbar-color: rgba(0, 0, 0, 0.12);
    --scrollbar-hover: rgba(0, 0, 0, 0.22);
    --transition-fast: 0.15s ease;
    --transition-base: 0.25s ease;
    --transition-slow: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

html.dark {
    /* Dark palette — deep navy/charcoal with indigo accent */
    --bg-color: #0f0f17;
    --bg-color-solid: #1a1a26;
    --bg-color-elevated: #22222e;
    --bg-color-solid-hover: #2a2a3a;
    --bg-color-glass: rgba(26, 26, 38, 0.78);
    --text-color: #e4e4ed;
    --text-color-secondary: #8888a0;
    --text-color-tertiary: #5c5c72;
    --text-color-light: #ffffff;
    --bd-color: rgba(255, 255, 255, 0.06);
    --bd-color-strong: rgba(255, 255, 255, 0.1);
    --accent: #818cf8;
    --accent-light: #a5b4fc;
    --accent-subtle: rgba(129, 140, 248, 0.1);
    --accent-hover: #6366f1;
    --success: #34d399;
    --danger: #f87171;
    --danger-subtle: rgba(248, 113, 113, 0.1);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2);
    --shadow-float: 0 20px 60px rgba(0, 0, 0, 0.45), 0 8px 20px rgba(0, 0, 0, 0.25);
    --scrollbar-color: rgba(255, 255, 255, 0.1);
    --scrollbar-hover: rgba(255, 255, 255, 0.2);
}

/* Element Plus overrides */
body {
    --el-color-primary: var(--accent);
    --el-color-primary-light-3: var(--accent-light);
    --el-color-primary-light-5: var(--accent-light);
    --el-color-primary-light-7: var(--accent-subtle);
    --el-color-primary-light-8: var(--accent-subtle);
    --el-color-primary-light-9: var(--accent-subtle);
    --el-color-primary-dark-2: var(--accent-hover);
    --el-color-danger: var(--danger);
    --el-color-success: var(--success);
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
    animation: enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) backwards;
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
