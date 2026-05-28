<template>
    <input class="c-progress-bar" type="range" :value="modelValue" :max="max"
        :style="{ '--progress': max ? (modelValue / max * 100) + '%' : '0%' }"
        @input="(e) => $emit('update:modelValue', Number((e.target as HTMLInputElement).value))" />
</template>

<script setup lang="ts">
defineProps<{
    modelValue: number
    max: number
}>()

defineEmits<{
    'update:modelValue': [value: number]
}>()
</script>

<style scoped>
.c-progress-bar {
    --progress: 0%;
    --bar-played: rgba(255, 255, 255, 0.5);
    --bar-track: rgba(255, 255, 255, 0.15);
    --bar-thumb: #fff;
    width: 100%;
    height: 16px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    outline: none;
}

.c-progress-bar::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(to right,
        var(--bar-played) 0%,
        var(--bar-played) var(--progress),
        var(--bar-track) var(--progress),
        var(--bar-track) 100%);
    transition: height 0.2s ease;
}

.c-progress-bar::-moz-range-track {
    height: 8px;
    border-radius: 999px;
    background: var(--bar-track);
    transition: height 0.2s ease;
}

.c-progress-bar::-moz-range-progress {
    height: 8px;
    border-radius: 999px;
    background: var(--bar-played);
}

.c-progress-bar:hover::-webkit-slider-runnable-track {
    height: 12px;
}

.c-progress-bar:hover::-moz-range-track {
    height: 12px;
}

.c-progress-bar:hover::-moz-range-progress {
    height: 12px;
}

.c-progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--bar-thumb);
    margin-top: -5px;
    margin-right: 6px;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.c-progress-bar::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--bar-thumb);
    margin-right: 6px;
    border: none;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.c-progress-bar:hover::-webkit-slider-thumb {
    opacity: 1;
}

.c-progress-bar:hover::-moz-range-thumb {
    opacity: 1;
}

.c-progress-bar:active::-webkit-slider-thumb {
    transform: scale(1.2);
}

.c-progress-bar:active::-moz-range-thumb {
    transform: scale(1.2);
}
</style>
