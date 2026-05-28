<template>
    <div id="cui-rmenu-cell-wrapper">
        <div id="cui-rmenu-cell-icon"><slot name="icon"></slot></div>
        <slot></slot>
    </div>
</template>

<style>
#cui-rmenu-cell-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: auto;
    height: 36px;
    margin: 2px;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
    background-color: transparent;
    font-size: 13px;
    padding: 2px 12px 2px 4px;
    cursor: pointer;
    color: var(--text-color);
}
#cui-rmenu-cell-wrapper:hover {
    background-color: var(--bg-color-solid-hover);
}
#cui-rmenu-cell-icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
