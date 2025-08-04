<template>
    <div class="min-h-[80vh] my-[5%]">
        <AboutMe />
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

import AboutMe from '@/components/AboutMe.vue'
import { useViewModeStore } from '@/stores/viewModeStores'

const viewModeStore = useViewModeStore()

onMounted(() => {
    viewModeStore.setMode("light")
})

onUnmounted(() => {
    viewModeStore.setMode("default")
})

</script>

<style scoped>

</style>