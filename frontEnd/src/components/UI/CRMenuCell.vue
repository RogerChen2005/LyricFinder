<template>
    <div id="cui-rmenu-cell-wrapper">
        <div id="cui-rmenu-cell-icon"><slot name="icon"></slot></div>
        <slot></slot>
    </div>
</template>

<style>
#cui-rmenu-cell-wrapper{
    display: flex;
    align-items: center;
    flex-direction: row;
    width: auto;
    height: 30px;
    margin: 5px;
    border-radius: 3px;
    transition: .5s;
    background-color:var(--bg-color-solid);
    font-size: 14px;
    padding: 2px 7px 2px 2px;
    cursor: pointer;
}
#cui-rmenu-cell-wrapper:hover{
    background-color:var(--bg-color-solid-hover);
}
#cui-rmenu-cell-icon{
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>