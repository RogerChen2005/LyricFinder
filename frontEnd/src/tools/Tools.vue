<template>
   <component :is="comp"></component>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import Tools from './index'

const route = useRoute()
const comp = shallowRef(Tools[route.params.name as string])
</script>

<style scoped>
</style>
