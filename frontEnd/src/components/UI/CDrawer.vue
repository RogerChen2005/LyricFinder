<template>
    <div @click.self="handleClose" id="mask" v-if="visible">
        <div ref="bg" id="bg">
            <div id="content">
                <slot name="content"></slot>
            </div>
            <div id="close" @click="handleClose"><box-icon color="var(--text-color)" size="20px" name="x"></box-icon></div>
        </div>
    </div>
</template>

<script>
export default {
    name:"CDrawer",
    props:{
        "visible":{
            type:Boolean,
            default:false
        }
    },
    methods:{
        handleClose(){
            this.$refs.bg.style.animation = "cui-drawer-disappear .3s ease-in";
            setTimeout(()=>this.$emit("update:visible",false),300);
        }
    }
}
</script>

<style>
    @keyframes cui-drawer-appear {
        0%{
            opacity: 0%;
            transform: translate(50%,-30%) scale(0.5);
        }
        100%{
            opacity: 100%;
            transform: translate(0,-50%) scale(1);
        }
    }
    @keyframes cui-drawer-disappear {
        0%{
            opacity: 100%;
            transform: translate(0,-50%) scale(1);
        }
        20%{
            opacity: 100%;
            transform: translate(5%,-47%) scale(1.1);
        }
        100%{
            opacity: 0%;
            transform: translate(50%,-30%) scale(0.5);
        }
    }
    @keyframes cui-drawer-blur{
        0%{
            backdrop-filter:blur(0px);
        }
        100%{
            backdrop-filter:blur(10px);
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
        backdrop-filter: blur(10px);
        animation: cui-drawer-blur .5s ;
    }  
    #bg{
        z-index: 2002;
        position: absolute;
        width: 800px;
        height: 80%;
        max-width: 50%;
        border: solid var(--bd-color) 1px;
        background-color: var(--bg-color-solid);
        border-radius: 8px;
        transform: translate(0,-50%);
        top: 50%;
        right: 10px;
        animation: cui-drawer-appear .5s cubic-bezier(0, 0, 0, 1.32);
    }
    #content{
        padding: 20px;
        height: calc(100% - 40px);
    }
    #close{
        position: absolute;
        right:0;
        top: 0;
        margin: 5px;
        cursor: pointer;
    }
</style>