<template>
    <div id="wrapper" class="rowbox container">
        <Post id="post"/>
    </div>
</template>

<script>
import Post from '@/md/about.md'
export default {
    name: "ManualPage",
    components:{
        Post
    },
    created() {

    }
}
</script>

<style>
#post {
    height:auto;
    margin-top: 20px;
    margin-bottom: 10px;
    padding-top:0;
    padding:30px;
    border-radius:10px;
    width: 80%;
    border:solid 1px var(--bd-color);
    color:var(--text-color);
    font-size: 18px;
}

#post h1{
    font-size: 50px;
    margin:20px;
    margin-left: 0;;
}

#wrapper {
    height:calc(100%);
    width: 100%;
    align-items: center;
    overflow: auto;
}
</style>