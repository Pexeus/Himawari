<template>
    <div class="lander">
        <img class="earth" src="../assets/earth.png" alt="">
        <div class="topLeft">
            <h1>Fresh from Himawari-8</h1>
            <p>Experience stunning, real-time Earth wallpapers from Himawari-8, crafted to fit your screen perfectly.
                Select your preferred lighting—bright, medium, or dark—and customize updates from every 15 minutes to
                once a day.
                Designed for any resolution and aspect ratio.
            </p>
        </div>
        <div class="footer">
            <button>
                <i class="gg-arrow-down"></i>
            </button>
        </div>
        <div class="divider">
            <div>
                
            </div>
            <div class="links">
                <a href="https://github.com/pexeus">
                    <img src="../assets/github.svg" alt="">
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.lander {
    background-color: black;
    color: white;
    width: 100vw;
    height: calc(100vh + 50px);
    overflow: hidden;
    position: relative;
    box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.5), -10px 0px 10px rgba(0, 0, 0, 0.5);
}

.footer {
    position: absolute;
    bottom: 50px;
    height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.divider {
    position: absolute;
    backdrop-filter: blur(10px);
    top: 100vh;
    height: 50px;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.divider img {
    height: 30px;
    padding: 10px;
    filter: invert();
    cursor: pointer;
}

.earth {
    height: 100%;
    position: absolute;
    right: 0;
    animation: fadeIn 4s ease-in-out forwards;
}

.topLeft {
    position: absolute;
    left: 0;
    padding-left: 5%;
    padding-top: 3.5%;
    width: 50%;
    max-width: 1000px;
    font-size: large;
    animation: flyIn 1s ease-in-out forwards;
    animation-delay: 1s;
    opacity: 0;
}

.topLeft h1 {
    font-size: 60pt;
    margin-bottom: 1.5%;
}

button {
    outline: none;
    padding: 6px;
    color: white;
    background-color: transparent;
    border: 0;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 15pt;
    border-radius: 30px;
    transition: all ease-in-out .3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
}

button:hover {
    background-color: white;
    color: black;
}

@keyframes fadeIn {
    from {
        filter: brightness(0);
    }

    to {
        filter: brightness(1);
    }
}

@keyframes flyIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>