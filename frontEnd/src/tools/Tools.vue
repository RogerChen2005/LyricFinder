<template>
   <component :is="comp"></component>
</template>

<script>
import Tools from './index.js'
export default{
  name: 'ToolsMain',
  data(){
    return{
    }
  },
  created(){
    this.comp = Tools[this.$route.params.name];
  }
}
</script>

<style scoped>

</style>