<template>
    <div class="w-full md:h-screen overflow-hidden relative">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <slot />
      </div>
      <video
      class="w-full rounded-lg h-full object-cover"
      :style="{ objectPosition: videoPosition }"
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
import { onMounted, onUnmounted, computed } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'
import { useViewModeStore } from '@/stores/viewModeStores'

const layoutStore = useLayoutStore()
const viewModeStore = useViewModeStore()

const imageServer = process.env.VUE_APP_UPLOAD_BASE_URL

const props = defineProps({
    source: {
        type: String,
        required: true
    },
    position: {
        type: String,
        default: 'center',
        validator: (value) => {
            const validPositions = [
                'center', 'top', 'bottom', 'left', 'right',
                'top-left', 'top-right', 'bottom-left', 'bottom-right'
            ];
            return validPositions.includes(value);
        }
    }
})

// Convert position prop to CSS object-position value
const videoPosition = computed(() => {
    const positionMap = {
        'center': 'center center',
        'top': 'center top',
        'bottom': 'center bottom',
        'left': 'left center',
        'right': 'right center',
        'top-left': 'left top',
        'top-right': 'right top',
        'bottom-left': 'left bottom',
        'bottom-right': 'right bottom'
    };
    
    return positionMap[props.position] || 'center center';
});

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