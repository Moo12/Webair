<template>
  <div class="w-full overflow-hidden relative">
    <!-- Scrollable container -->
    <div
      @mouseenter="pauseScroll"
      @mouseleave="resumeScroll"
      ref="scrollContainer"
      class="flex w-full overflow-x-scroll no-scrollbar"
    >
      <!-- Duplicate the images for a seamless loop. Duplicating once is sufficient. -->
      <div
        v-for="(item, index) in duplicatedImages"
        :key="index"
        class="shrink-0 bg-cover aspect-dynamic"
        :style="{
          backgroundImage: `url(${imageServer}${item.src})`,
          width: `${imagePercentage}%`,
          marginRight: `${spacing}%`
        }"
      >
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  imagePercentage: {
    type: Number,
    default: 21,
    validator: (value) => value > 0 && value <= 100
  },
  spacing: {
    type: Number,
    default: 5,
    validator: (value) => value >= 0 && value <= 50
  },
  scrollSpeed: {
    type: Number,
    default: 0.3,
    validator: (value) => value > 0 && value <= 10
  },
  aspectRatio: {
    type: String,
    default: '1.5',
    validator: (value) => {
      // Validate aspect ratio format (e.g., '1.5', '16/9', '4/3')
      return /^[\d.]+$|^\d+\/\d+$/.test(value);
    }
  }
})

const imageServer = process.env.VUE_APP_UPLOAD_BASE_URL

const scrollContainer = ref(null)
let animationFrame
let isPaused = false

// Create a new array with images duplicated for a seamless loop
// Duplicating once is all that's needed for a right-to-left loop.
const duplicatedImages = computed(() => {
  if (props.images && props.images.length > 0) {
    return [...props.images, ...props.images]
  }
  return []
})

// Calculate the total width of a single set of images, including spacing
const totalImageSetWidth = computed(() => {
  if (!scrollContainer.value || !props.images.length) return 0;
  
  const containerWidth = scrollContainer.value.getBoundingClientRect().width;
  const itemWidth = (containerWidth * props.imagePercentage / 100);
  const itemSpacing = (containerWidth * props.spacing / 100);
  
  return (itemWidth + itemSpacing) * props.images.length;
});


const animate = () => {
  // If paused or container is not ready, do nothing
  if (isPaused || !scrollContainer.value) {
    return;
  }
  
  // Scroll left by the defined speed
  scrollContainer.value.scrollLeft -= props.scrollSpeed
  
  // If the scroll position reaches the beginning, reset it to the start of the second set
  if (scrollContainer.value.scrollLeft <= -1 *  totalImageSetWidth.value) {
    // We use a small epsilon to prevent floating point issues
    scrollContainer.value.scrollLeft = 0;
  }
  
  animationFrame = requestAnimationFrame(animate)
}

const pauseScroll = () => {
  isPaused = true
  cancelAnimationFrame(animationFrame)
}

const resumeScroll = () => {
  if (isPaused) {
    isPaused = false
    animationFrame = requestAnimationFrame(animate)
  }
}

onMounted(() => {
  // Use nextTick to ensure the DOM is updated and container width is available
  nextTick(() => {
    if (scrollContainer.value) {
      // For a right-to-left loop, start at the beginning of the second set of images
      // This is necessary to avoid the initial jump.
      scrollContainer.value.scrollLeft = 0;
      animationFrame = requestAnimationFrame(animate);
    }
  });
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
})
</script>

<style scoped>
/* Dynamic aspect ratio class */
.aspect-dynamic {
  aspect-ratio: v-bind(aspectRatio);
}

/* Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
