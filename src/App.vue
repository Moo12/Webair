<template>
  <div class="content">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import useLanguageDirection from './composables/useLanguageDirection';

const { dir } = useLanguageDirection('he')
document.documentElement.setAttribute('dir', dir.value)
</script>

<style>
.content {
  margin: 0 0;
  position: relative; /* Ensures proper stacking */
  max-width: 100%;
}
</style>
