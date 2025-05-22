<template>
    <div class="head">
        <i class="gg-linear"></i>
        <p>Himawari</p>
        <div class="controls">
            <i class="gg-close"></i>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
.head {
    background-color: white;
    width: 100%;
    height: 30px;
    -webkit-app-region: drag;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text);
    position: relative;
    box-shadow: 0px 0px 8px var(--shadow);
}

.head p {
    font-size: small;
}

.controls {
    margin-right: 5px;
}

.gg-linear {
    margin-left: 5px;
    transform: scale(0.8);
    color: var(--primary);
}
</style>