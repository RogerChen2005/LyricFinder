<template>
    <div v-if="visible" ref="bg" id="bg" :style="{backgroundImage:bg}">
        <div id="left">
            <slot name="left"></slot>
        </div>
        <div id="right">
            <slot name="right"></slot>
        </div>
        <div id="close" @click="handleClose"><box-icon color='var(--text-color-light)' size="35px" name="x"></box-icon></div>
    </div>
</template>

<script>
export default {
    name: "CPage",
    props: {
        "visible": {
            type: Boolean,
            default: false
        },
        "bg":{
            type:String,
            default:""
        }
    },
    methods: {
        handleClose() {
            this.$refs.bg.style.animation = "cui-page-disappear .3s cubic-bezier(1, 0, 1, 1)";
            this.$emit("close",null);
            setTimeout(() => {
                this.$emit("update:visible", false);
            }, 300);
        }
    },
}
</script>

<style>
@keyframes cui-page-appear {
    0% {
        opacity: 0%;
        transform: translate(-50%, -50%) scale(0.8);
    }

    100% {
        opacity: 100%;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes cui-page-disappear {
    0% {
        opacity: 100%;
        transform: translate(-50%, -50%) scale(1);
    }

    100% {
        opacity: 0%;
        transform: translate(-50%, -50%) scale(0.8);
    }
}
</style>

<style scoped>

#bg {
    z-index: 2003;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-solid);
    border-radius: 8px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    animation: cui-page-appear .4s cubic-bezier(0, 0, 0, 1);
    color:var(--text-color-light);
}

#bg::after{
    z-index: 2004;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(8px) brightness(80%);
}

#left {
    z-index: 2005;
    position: absolute;
    left: 20%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 27%;
    height: 80%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#right{
    z-index: 2006;
    position: absolute;
    left: 70%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 55%;
    height: 80%;
}

#close {
    z-index: 2007;
    position: absolute;
    right: 0;
    top: 0;
    margin: 25px;
    cursor: pointer;
}
</style>