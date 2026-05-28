<template>
    <div @click.self="handleClose" id="mask" v-if="visible">
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
    if (bg.value) bg.value.style.animation = 'cui-drawer-disappear .3s ease-in'
    setTimeout(() => emit('update:visible', false), 300)
}
</script>

<style>
    @keyframes cui-drawer-appear {
        0%{
            opacity: 0;
            transform: translate(50%,-30%) scale(0.95);
        }
        100%{
            opacity: 1;
            transform: translate(0,-50%) scale(1);
        }
    }
    @keyframes cui-drawer-disappear {
        0%{
            opacity: 1;
            transform: translate(0,-50%) scale(1);
        }
        20%{
            opacity: 1;
            transform: translate(3%,-48%) scale(1.02);
        }
        100%{
            opacity: 0;
            transform: translate(50%,-30%) scale(0.95);
        }
    }
    @keyframes cui-drawer-blur{
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
        z-index: 2010;
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(12px);
        animation: cui-drawer-blur .4s;
        background: rgba(0,0,0,0.15);
    }
    #bg{
        z-index: 2002;
        position: absolute;
        width: 800px;
        height: 80%;
        max-width: 50%;
        border: 1px solid var(--bd-color);
        background-color: var(--bg-color-elevated);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-float);
        transform: translate(0,-50%);
        top: 50%;
        right: 10px;
        animation: cui-drawer-appear .4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #content{
        padding: 24px;
        height: calc(100% - 48px);
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
