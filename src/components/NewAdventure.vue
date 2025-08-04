<template>
    <div class="w-full relative" 
        :style="{height: `${mapWrapHeight * 1.5}px`}">
        <div class="grid grid-cols-6 gap-x-[20%] gap-y-[10%] md:gap-y-[10%] main-padding">
            <div class="col-span-4 md:col-span-2">
                <div class="h-[50%] flex flex-wrap items-end pb-1">
                    <TitleSection class="z-[10]" title="מה ההרפתקאה הבאה שלך?"  :fontSize="screen.isMobile ? 'eighteen-px' : 'twenty-seven-px'" />
                </div>

            </div>
            
            <div ref="mapWrap" class="col-span-6 md:col-span-4  overflow-hidden rounded-3xl z-[10] bg-black-light aspect-[1.5]">
                <img :src="mediaServer + mapImage" alt="" class="w-full h-auto object-cover">
            </div>
        </div>
        <!-- Background image positio   ned halfway down the map image -->
        <div v-if="!screen.isMobile"
        class="absolute w-full object-cover bg-center z-[9]"
        :style="{
            top: '33.3%',
            height: `${mapWrapHeight}px`,
            backgroundImage: `url(${mediaServer + backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom'
        }"
        ></div>
    </div> 
</template>

<script setup>
import { ref, computed} from 'vue'
import TitleSection from './TitleSection.vue'
import { useScreenStore } from '@/stores/screen'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const generalCollectionStore = useGeneralCollectionStore()

const backgroundImage = computed(() => {
  const doc = generalCollectionStore.document('map')
  return getImageUrlFromDoc(doc, 'background')
})

const mapImage = computed(() => {
  const doc = generalCollectionStore.document('map')
  return getImageUrlFromDoc(doc, 'main')
})



const screen = useScreenStore()

const mapWrap = ref(null)

const mapWrapHeight = computed(() => {
  if (mapWrap.value) {
    return mapWrap.value.offsetHeight
  }

  return 0
})
</script>

<style scoped>
</style>
  