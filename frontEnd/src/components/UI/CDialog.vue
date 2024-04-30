<template>
    <div id="mask" v-if="visible">
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
    name:"CDiaLog",
    props:{
        "visible":{
            type:Boolean,
            default:false
        }
    },
    methods:{
        handleClose(){
            this.$refs.bg.style.animation = "cui-dialog-disappear .3s ease-in";
            setTimeout(()=>this.$emit("update:visible",false),300);
        }
    }
}
</script>

<style>
    @keyframes cui-dialog-appear {
        0%{
            opacity: 0%;
            transform: translate(-50%,-50%) scale(0.5);
        }
        100%{
            opacity: 100%;
            transform: translate(-50%,-50%) scale(1);
        }
    }
    @keyframes cui-dialog-disappear {
        0%{
            opacity: 100%;
            transform: translate(-50%,-50%) scale(1);
        }
        100%{
            opacity: 0%;
            transform: translate(-50%,-50%) scale(0.5);
        }
    }
    @keyframes cui-dialog-blur{
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
        z-index: 500;
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
        animation: cui-dialog-blur .5s ;
    }
    #bg{
        position: absolute;
        width: 500px;
        height: 300px;
        max-width: 80%;
        border: solid var(--bd-color) 1px;
        background-color: var(--bg-color-solid);
        border-radius: 8px;
        transform: translate(-50%,-50%);
        top: 50%;
        left: 50%;
        animation: cui-dialog-appear .4s cubic-bezier(0, 0, 0.36, 1.29);
    }
    #content{
        padding: 20px;
        height: 100%;
    }
    #close{
        position: absolute;
        right:0;
        top: 0;
        margin: 5px;
        cursor: pointer;
    }
</style>