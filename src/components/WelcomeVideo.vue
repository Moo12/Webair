<template>
    <div class="w-full md:h-screen overflow-hidden relative">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <slot />
      </div>
      <video
      class="w-full rounded-lg"
      controls
      autoplay
      muted
      loop
      playsinline
    >
      <source :src="imageServer + source" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    </div>

</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'
import { useViewModeStore } from '@/stores/viewModeStores'

const layoutStore = useLayoutStore()
const viewModeStore = useViewModeStore()

const imageServer = process.env.VUE_APP_UPLOAD_BASE_URL

const props = defineProps({
    source: {
        type: String,
        required: true
    }
})

onMounted(() => {
    layoutStore.setMargin("mx-[1%]")
    viewModeStore.setMode("dark")
})

onUnmounted( () => {
    layoutStore.setToDefault()
})

</script>

<style>
</style>