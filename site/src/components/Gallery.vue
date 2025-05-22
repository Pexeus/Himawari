<template>
    <div class="gallery">
        <div class="menu">
            <button>
                <i class="gg-microsoft"></i>
                Download
            </button>
        </div>
        <div class="images">
            <img :src="`${data.api}/wallpaper/900/1600/${data.luminance}`" class="portrait" @load="onImageLoad($event)">
            <img :src="`${data.api}/wallpaper/1600/900/${data.luminance}`" class="landscape"
                @load="onImageLoad($event)">
            <img :src="`${data.api}/wallpaper/1800/700/${data.luminance}`" class="ultrawide"
                @load="onImageLoad($event)">
            <img :src="`${data.api}/wallpaper/700/1600/${data.luminance}`" class="portrait2"
                @load="onImageLoad($event)">
            <div class="selection">
                <p :class="{ selected: data.luminance === 20 }" @click="setLuminance(20)">Dark</p>
                <p :class="{ selected: data.luminance === 50 }" @click="setLuminance(50)">Medium</p>
                <p :class="{ selected: data.luminance === 100 }" @click="setLuminance(100)">Bright</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { api } from '../constants';

const data = reactive({
    luminance: 50, // Default to medium
    api: api
});

const onImageLoad = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');

    updatePlacement();
};

const setLuminance = (value: number) => {
    // Reset loaded classes to trigger reload animation
    document.querySelectorAll('.images img').forEach(img => img.classList.remove('loaded'));

    setTimeout(() => {
        data.luminance = value;
    }, 500);
};

function updatePlacement() {
    const p2 = document.querySelector(".portrait2") as HTMLImageElement;
    const landscape = document.querySelector(".landscape") as HTMLImageElement;
    const portrait = document.querySelector(".portrait") as HTMLImageElement;
    const ultrawide = document.querySelector(".ultrawide") as HTMLImageElement;
    const offset = Math.max(landscape.width + portrait.width + 20, ultrawide.width);
    console.log(`UW: ${ultrawide.width} \n LN: ${landscape.width + portrait.width + 20}`);
    p2.style.left = `${offset + 30}px`;
}

window.addEventListener("resize", updatePlacement);
</script>

<style scoped>
.gallery {
    background-color: #f5f5f5;
    height: calc(100vh - 50px);
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

button {
    outline: none;
    padding: 8px;
    color: black;
    background-color: transparent;
    border: 2px solid black;
    padding-left: 25px;
    padding-right: 40px;
    font-size: 18pt;
    margin: 50px;
    border-radius: 30px;
    transition: all ease-in-out .3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
}

button:hover {
    background-color: black;
    color: white;
}

.selection {
    display: flex;
    border: 2px solid black;
    width: 50%;
    border-radius: 30px;
    align-items: center;
    justify-content: space-evenly;
    overflow: hidden;
    margin-top: 20px;
    position: absolute;
    top: calc(40% + 30px);
    left: calc(25% + 30px);
}

.selection p {
    text-align: center;
    width: 100%;
    padding: 5px;
    cursor: pointer;
    margin: 0;
    transition: all ease-in-out .3s;
}

.selection p.selected {
    background-color: black;
    color: white;
}

.selection p:hover {
    background-color: #ddd;
}

.images {
    height: 70%;
    width: 60%;
    max-width: 1000px;
    position: relative;
}

.images img {
    border-radius: 16px;
    position: absolute;
    background-color: #ccc;
    /* Gray placeholder */
    filter: brightness(0);
    /* Hide image content while loading */
    animation: fadeOut .5s ease-in-out forwards;
}

.images img.loaded {
    background-color: transparent;
    /* Remove gray background when loaded */
    animation: fadeIn 1s ease-in-out forwards;
}

@keyframes fadeOut {
    from {
        filter: brightness(1);
    }

    to {
        filter: brightness(0);
    }
}

@keyframes fadeIn {
    from {
        filter: brightness(0);
    }

    to {
        filter: brightness(1);
    }
}

.portrait {
    width: 25%;
    top: calc(40% + 30px);
    left: 10px;
}

.landscape {
    width: 50%;
    top: calc(40% + 120px);
    left: calc(25% + 30px);
}

.ultrawide {
    height: 40%;
    top: 10px;
    left: 10px;
}

.portrait2 {
    width: 25%;
    top: 50px;
}
</style>