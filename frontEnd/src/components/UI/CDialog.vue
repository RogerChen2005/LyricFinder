<template>
    <div id="mask" v-if="visible">
        <div ref="bg" id="bg">
            <div id="content">
                <slot name="content"></slot>
            </div>
            <div id="close" @click="handleClose"><box-icon color="var(--text-color-secondary)" size="20px" name="x"></box-icon></div>
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
    if (bg.value) bg.value.style.animation = 'cui-dialog-disappear .3s ease-in'
    setTimeout(() => emit('update:visible', false), 300)
}
</script>

<style>
    @keyframes cui-dialog-appear {
        0%{
            opacity: 0;
            transform: translate(-50%,-50%) scale(0.95);
        }
        100%{
            opacity: 1;
            transform: translate(-50%,-50%) scale(1);
        }
    }
    @keyframes cui-dialog-disappear {
        0%{
            opacity: 1;
            transform: translate(-50%,-50%) scale(1);
        }
        100%{
            opacity: 0;
            transform: translate(-50%,-50%) scale(0.95);
        }
    }
    @keyframes cui-dialog-blur{
        0%{
            backdrop-filter:blur(0px);
        }
        100%{
            backdrop-filter:blur(12px);
        }
    }
</style>

<style scoped>
    #mask{
        z-index: 500;
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(12px);
        animation: cui-dialog-blur .4s;
        background: rgba(0,0,0,0.15);
    }
    #bg{
        position: absolute;
        width: 500px;
        height: 300px;
        max-width: 80%;
        border: 1px solid var(--bd-color);
        background-color: var(--bg-color-elevated);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-float);
        transform: translate(-50%,-50%);
        top: 50%;
        left: 50%;
        animation: cui-dialog-appear .35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #content{
        padding: 24px;
        height: 100%;
    }
    #close{
        position: absolute;
        right: 0;
        top: 0;
        margin: 12px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background var(--transition-fast);
    }
    #close:hover {
        background: var(--bg-color-solid-hover);
    }
</style>
