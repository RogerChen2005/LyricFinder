<template>
    <div id="wrapper" class="rowbox container">
        <Post id="post"/>
    </div>
</template>

<script setup lang="ts">
import Post from '@/md/about.md'
</script>

<style>
#post {
    height: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    padding: 32px;
    border-radius: var(--radius-lg);
    width: 80%;
    border: 1px solid var(--bd-color);
    background: var(--bg-color-solid);
    color: var(--text-color);
    font-size: 15px;
    line-height: 1.8;
    box-sizing: border-box;
}

#post h1 {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 24px;
    letter-spacing: -0.5px;
    color: var(--text-color);
}

#post h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 24px 0 12px;
    color: var(--text-color);
}

#post p {
    color: var(--text-color-secondary);
}

#post a {
    color: var(--accent);
    text-decoration: none;
}

#post a:hover {
    text-decoration: underline;
}

#wrapper {
    height: 100%;
    width: 100%;
    align-items: center;
    overflow: auto;
    box-sizing: border-box;
    padding: 0 36px;
}
</style>
