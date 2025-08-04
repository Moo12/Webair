<template>
  <div class="relative w-full" ref="containerRef">
    <img
      :src="mediaServer + backgorundImg"
      alt="intro"
      ref="imageRef"
      class="w-full h-auto block absolute inset-0 z-0"
      style="object-fit: fill; object-position: bottom;"
      @load="setContentMinHeight"
    />
    <!-- Your content can be absolutely positioned over the image if needed -->
    <div 
      ref="contentRef"
      class="grid grid-cols-12 justify-center items-center main-padding w-full gap-y-10"
      :style="{ minHeight: contentMinHeight + 'px' }"
    >
        <div class="col-span-8 md:col-span-4">
            <TitleSection :fontSize="screen.isMobile ? 'eighteen-px' : 'fifty-four-px'">
                <template #title>
                    {{ title }}
                </template>
            </TitleSection>
        </div>
        <div class="md:col-span-10 col-span-12 md:col-start-6 text-[24px] z-10"
        :class="{ 'text-[18px]': screen.isMobile,
            'text-[24px]': !screen.isMobile,
         }">
            <slot />
        </div>
        
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useScreenStore } from '@/stores/screen'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'

import useLanguageDirection from "@/composables/useLanguageDirection"
import TitleSection from "./TitleSection.vue"
const generalCollectionStore = useGeneralCollectionStore()

import { getImageUrlFromDoc } from '@/composables/imageUtils'

const screen = useScreenStore()
const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  language: {
      type: String,
      required: true,
      default: 'he'
    },
})

const doc_id = 'introduction'

const backgorundImg = computed(() => {
  const doc = generalCollectionStore.document(doc_id)

  return getImageUrlFromDoc(doc, "background") || null
})

const { textAlign } = useLanguageDirection(props.language)

const imageRef = ref(null)
const contentRef = ref(null)
const contentMinHeight = ref(0)
const containerRef = ref(null)

const setContentMinHeight = () => {
  if (imageRef.value && contentRef.value && containerRef.value) {
    if (screen.isMobile) {
      // Mobile: Keep current behavior - content min-height equals image height
      const imageHeight = imageRef.value.offsetHeight
      contentMinHeight.value = imageHeight
    } else {
      // Desktop: Set content height first, then make image 10% higher
      // Get the natural content height
      const contentHeight = contentRef.value.scrollHeight
      
      // Set content min-height to its natural height
      contentMinHeight.value = contentHeight
      
      // Set image height to be 10% higher than content
      const imageHeight = contentHeight * 1.5
      imageRef.value.style.height = imageHeight + 'px'
      
      // Set container height to match image height
      containerRef.value.style.height = imageHeight + 'px'
      
      console.log('Desktop: Content height:', contentHeight, 'Image height:', imageHeight)
    }
  }
}

onMounted(() => {
  // Set initial height if image is already loaded
  if (imageRef.value && imageRef.value.complete) {
    setContentMinHeight()
  }
})
</script>

<style>

</style>