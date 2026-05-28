<template>
    <div id="mask" @click.self="handleClose" v-if="visible">
        <div ref="bg" id="bg">
            <div id="content">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
    visible?: boolean
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
}>()

const bg = ref<HTMLElement>()

function handleClose() {
    if (bg.value) bg.value.style.animation = 'cui-rmenu-disappear .15s ease-in'
    setTimeout(() => emit('update:visible', false), 150)
}

function handleOpen(x: number, y: number) {
    setTimeout(() => {
        if (bg.value) {
            bg.value.style.top = `${y}px`
            bg.value.style.left = `${x}px`
        }
    }, 0)
}

defineExpose({ handleOpen })
</script>

<style>
@keyframes cui-rmenu-appear {
    0% {
        opacity: 0;
        transform: translate(-25%,-25%) scale(0.9);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes cui-rmenu-disappear {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-25%,-25%) scale(0.9);
    }
}
</style>

<style scoped>
#mask {
    z-index: 2007;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

#bg {
    position: absolute;
    width: auto;
    height: auto;
    max-width: 80%;
    border: 1px solid var(--bd-color);
    background-color: var(--bg-color-elevated);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    animation: cui-rmenu-appear .2s cubic-bezier(0.16, 1, 0.3, 1);
    padding: 4px;
}

#content {
    height: 100%;
}
</style>
