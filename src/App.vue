<template>
  <div class="content" :dir="dir">
    <Navbar/>
    <div class="">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

import { useScreenStore } from './stores/screen'
import useLanguageDirection from './composables/useLanguageDirection'

import { useGeneralCollectionStore } from './stores/generalDocStore'
import { useCollectionsStore } from './stores/collectionsStore'

import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const screen = useScreenStore()

const { dir } = useLanguageDirection('he')

onMounted(() => {
  screen.init()
  useGeneralCollectionStore().init()
  useCollectionsStore().init()
})

onUnmounted(() => {
  screen.destroy()
  useCollectionsStore().clearAll()
})
</script>

<style>
.content {
  margin: 0 0;
  position: relative; /* Ensures proper stacking */
  max-width: 100%;
  overflow-x: hidden;
}
</style>
