<template>
    <div v-if="visible" ref="bgEl" id="bg" :style="{backgroundImage: bg}">
        <div id="left">
            <slot name="left"></slot>
        </div>
        <div id="right">
            <slot name="right"></slot>
        </div>
        <div id="close" @click="handleClose"><box-icon color='var(--text-color-light)' size="28px" name="x"></box-icon></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    visible?: boolean
    bg?: string
}>()

const emit = defineEmits<{
    close: [value: null]
    'update:visible': [value: boolean]
}>()

const bgEl = ref<HTMLElement>()

function handleClose() {
    if (bgEl.value) bgEl.value.style.animation = 'cui-page-disappear .3s cubic-bezier(1, 0, 1, 1)'
    emit('close', null)
    setTimeout(() => emit('update:visible', false), 300)
}

defineExpose({ handleClose })
</script>

<style>
@keyframes cui-page-appear {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.92);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes cui-page-disappear {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.92);
    }
}
</style>

<style scoped>
#bg {
    z-index: 2003;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-solid);
    border-radius: var(--radius-lg);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    animation: cui-page-appear .4s cubic-bezier(0.16, 1, 0.3, 1);
    color: var(--text-color-light);
    overflow: hidden;
}

#bg::after {
    z-index: 2004;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(20px) brightness(75%) saturate(1.2);
}

#left {
    z-index: 2005;
    position: absolute;
    left: 20%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 27%;
    height: 80%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#right {
    z-index: 2006;
    position: absolute;
    left: 70%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 55%;
    height: 80%;
}

#close {
    z-index: 2007;
    position: absolute;
    right: 0;
    top: 0;
    margin: 20px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background var(--transition-fast);
}

#close:hover {
    background: rgba(255,255,255,0.1);
}
</style>
