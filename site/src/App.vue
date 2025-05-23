<template>
  <div class="ui">
    <Lander></Lander>
    <Gallery></Gallery>
  </div>
</template>

<script setup lang="ts">
import Lander from "./components/Lander.vue"
import Gallery from "./components/Gallery.vue"

document.addEventListener('DOMContentLoaded', () => {
  const preventScroll = (e: WheelEvent) => e.preventDefault();
  window.addEventListener('wheel', preventScroll, { passive: false });

  setTimeout(() => {
    window.removeEventListener('wheel', preventScroll);

    window.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const toBottom = e.deltaY > 0;
      window.scrollTo({
        top: toBottom ? document.body.scrollHeight : 0,
        behavior: 'smooth'
      });
    }, { passive: false });
  }, 2000);
});
</script>

<style scoped></style>
