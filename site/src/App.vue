<template>
  <div class="ui">
    <Lander></Lander>
    <Gallery></Gallery>
  </div>
</template>

<script setup lang="ts">
import Lander from "./components/Lander.vue"
import Gallery from "./components/Gallery.vue"

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  const toBottom = e.deltaY > 0;
  window.scrollTo({
    top: toBottom ? document.body.scrollHeight : 0,
    behavior: 'smooth'
  });
}, { passive: false });
</script>

<style scoped></style>
