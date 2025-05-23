<template>
    <div class="gallery">
        <div class="menu">
            <button>
                <div class="iconContainer">
                    <i class="gg-microsoft"></i>
                </div>
                <h3>Download</h3>
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

    setTimeout(() => {
        img.classList.add('loaded');
    }, 800 * Math.random());

    updatePlacement();
};

const setLuminance = (value: number) => {
    // Reset loaded classes to trigger reload animation
    document.querySelectorAll('.images img').forEach(img => {
        setTimeout(() => {
            img.classList.remove('loaded')
        }, 400 * Math.random());
    });

    setTimeout(() => {
        data.luminance = value;
    }, 1000);
};

function updatePlacement() {
    const p2 = document.querySelector(".portrait2") as HTMLImageElement;
    const landscape = document.querySelector(".landscape") as HTMLImageElement;
    const portrait = document.querySelector(".portrait") as HTMLImageElement;
    const ultrawide = document.querySelector(".ultrawide") as HTMLImageElement;
    const container = document.querySelector(".images") as HTMLImageElement;
    const offset = Math.max(landscape.width + portrait.width + 20, ultrawide.width);

    if (offset * 1.25 > container.getBoundingClientRect().width) {
        p2.style.display = 'none'
    }
    else {
        p2.style.display = 'inline-block'
        p2.style.left = `${offset + 30}px`;
    }
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
    background-color: black;
    color: white;
    border: 0;
    width: 200px;
    height: 200px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.315);
    transition: ease-in-out .2s;
    cursor: pointer;
}

button:hover {
    box-shadow: 0px 6px 4x rgba(0, 0, 0, 0.5);
    transform: translateY(-5px);
}

button .iconContainer {
    padding-top: 40px;
}

button i {
    transform: scale(3.5);
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
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.5);
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