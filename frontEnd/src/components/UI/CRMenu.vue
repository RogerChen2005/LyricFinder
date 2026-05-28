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
        opacity: 0%;
        transform: translate(-25%,-25%) scale(0.5);
    }
    100% {
        opacity: 100%;
        transform: scale(1);
    }
}

@keyframes cui-rmenu-disappear {
    0% {
        opacity: 100%;
        transform: scale(1);
    }
    100% {
        opacity: 0%;
        transform: translate(-25%,-25%) scale(0.5);
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
    border: solid var(--bd-color) 1px;
    background-color: var(--bg-color-solid);
    border-radius: 8px;
    animation: cui-rmenu-appear .25s cubic-bezier(0, 0, 0.36, 1.29);
}

#content {
    height: 100%;
}

#close {
    position: absolute;
    right: 0;
    top: 0;
    margin: 5px;
    cursor: pointer;
}
</style>
