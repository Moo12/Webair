<template>
  <div
    class="w-full overflow-hidden relative"
    @mouseenter="pauseScroll"
    @mouseleave="resumeScroll"
  >
    <!-- Scrollable container -->
    <div
      ref="scrollContainer"
      class="flex w-full overflow-x-scroll no-scrollbar scroll-snap"
      :style="scrollStyle"
    >
      <div
        v-for="(item, index) in images"
        :key="index"
        class="shrink-0 bg-cover aspect-[0.8] basis-[21%] mr-[5%]"
        :style="{ backgroundImage: `url(${item.src})`}"
      >
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})


const scrollContainer = ref(null)
let animationFrame
let scrollX = 0
let isPaused = false
const scrollSpeed = 0.3

const scrollStyle = {
  transition: 'transform 0.1s linear',
}

const animate = () => {
  if (!isPaused && scrollContainer.value) {
    console.log("animate")
    scrollX += scrollSpeed
    
    scrollContainer.value.scrollBy({ left: scrollSpeed })
    
    if (scrollContainer.value.scrollLeft === 0) {
      console.log("reset scroll x")
      scrollX = 0
      
      scrollContainer.value.style.scrollBehavior = "auto"
      
      // Jump back to the left
      scrollContainer.value.scrollBy({ left: scrollContainer.value.clientWidth * -1 })

      // Re-enable smooth scroll
      requestAnimationFrame(() => {
        scrollContainer.value.style.scrollBehavior = "smooth"
      })
    }
    animationFrame = requestAnimationFrame(animate)
  }
}

const pauseScroll = () => {
  console.log("pAUSE")
  isPaused = true
}

const resumeScroll = () => {
  isPaused = false
  requestAnimationFrame(animate)
}

onMounted(() => {
  scrollContainer.value.scrollBy({ left: scrollContainer.value.clientWidth * -1 })

  console.log ("scrollContainer",scrollContainer.value.scrollLeft)
  animationFrame = requestAnimationFrame(animate)
})


onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})
</script>

<style>

</style>
