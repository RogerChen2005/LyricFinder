<template>
    <div id = "main_content" class="container">
        <h1>欢迎使用 Lyric Finder！</h1>
        <p style="text-indent: 2rem;">Lyric Finder 现已经过重构，变得更加易用</p>
        <el-divider />
        <h3>更新日志：</h3>
        <p style="text-indent: 1rem;">2023.12.17</p>
        <p style="text-indent: 2rem;">更新了对系统播放菜单的支持(Media Session API),更新了一键跳转(搜索框内输入分享链接)</p>
        <p style="text-indent: 1rem;">2023.12.15</p>
        <p style="text-indent: 2rem;">增加了歌手页面，改进了专辑页面，更新了链接的跳转（歌手，专辑）</p>
        <p style="text-indent: 1rem;">2023.12.10</p>
        <p style="text-indent: 2rem;">重构项目的结束, Full support for web API</p>
        <p style="text-indent: 1rem;">2023.6.20</p>
        <p style="text-indent: 2rem;">重构项目的开始</p>
        <el-divider />
        <h1>我们保证不会收集您的个人信息</h1>
        <p style="text-indent: 2rem;">所有的您的个人信息均存储在您的浏览器中，并不会发送至服务器</p>
        <el-divider />
        <h1>为 Lyric Finder 作出您的贡献</h1>
        <p style="text-indent: 2rem;">Lyric Finder的所有代码开源,访问 <a href="https://github.com/RogerChen2005/LyricFinder">Github</a> 了解更多</p>
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
    height: 100%;
    overflow: auto;
}

</style>