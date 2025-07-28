<template>
  <div class="relative w-full">
    <img
      :src="mediaServer + backgorundImg"
      alt="intro"
      class="w-full h-auto block"
      style="object-fit: contain;"
    />
    <!-- Your content can be absolutely positioned over the image if needed -->
    <div class="absolute  bottom-[20%] top-0 grid grid-cols-12 justify-center items-center main-padding w-full gap-y-10">
        <div class="col-span-10 md:col-span-4">
            <TitleSection :fontSize="screen.isMobile ? 'eighteen-px' : 'fifty-four-px'">
                <template #title>
                    {{ title }}
                </template>
            </TitleSection>
        </div>
        <div class="md:col-span-10 col-span-12 md:col-start-6 text-[24px]"
        :class="{ 'text-[18px]': screen.isMobile,
            'text-[24px]': !screen.isMobile,
         }">
            <slot />
        </div>
        
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import useLanguageDirection from "@/composables/useLanguageDirection"
import TitleSection from "./TitleSection.vue"
import { useScreenStore } from '@/stores/screen'

import { useGeneralCollectionStore } from '@/stores/generalDocStore'
const generalCollectionStore = useGeneralCollectionStore()

import { getImageUrlFromDoc } from '@/composables/imageUtils'

const screen = useScreenStore()

const props = defineProps({
    language: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
})

const doc_id = 'introduction'

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const backgorundImg = computed(() => {
  const doc = generalCollectionStore.document(doc_id)

  return getImageUrlFromDoc(doc, "background") || null
})

const { textAlign } = useLanguageDirection(props.language)

</script>

<style>

</style>