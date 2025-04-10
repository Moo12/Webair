<template>
  <div
    class="w-full overflow-hidden relative"
    @mouseenter="pauseScroll"
    @mouseleave="resumeScroll"
  >
    <!-- Scrollable container -->
    <div
      ref="scrollContainer"
      class="flex w-full"
      :style="scrollStyle"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="shrink-0 basis-[30%] mr-[2%]"
      >
        <div class="w-full aspect-square overflow-hidden">
          <img
            :src="image"
            alt=""
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import vietnam from '@/../public/img/webair-vietnam.jpg'
import cyprus from '@/../public/img/webair-cyprus.jpg'

const images = [
  vietnam,
  cyprus,
  vietnam,
  cyprus,
  vietnam,
  cyprus
]

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
    scrollX += scrollSpeed
    scrollContainer.value.scrollLeft = scrollX
    if (scrollX >= scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth) {
      scrollX = 0
    }
  }
  animationFrame = requestAnimationFrame(animate)
}

const pauseScroll = () => {
  isPaused = true
}

const resumeScroll = () => {
  isPaused = false
}

onMounted(() => {
  animationFrame = requestAnimationFrame(animate)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})
</script>
