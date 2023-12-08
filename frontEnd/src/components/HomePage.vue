<template>
    <div id = "main_content" class="container">
        <h1>欢迎回来！</h1>
        <p style="text-indent: 2rem;">LyricFinder现已经过重构，变得更加易用</p>
        <el-divider />
        <h3>更新日志：</h3>
        <p style="text-indent: 1rem;">2023.6.20</p>
        <p style="text-indent: 2rem;">重构项目的开始</p>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    props: {
    }
}
</script>

<style scoped>

#main_content{
    text-align: left;
    padding-left: 50px;
    font-size: 25px;
    line-height: 30px;
}

</style>