<template>
    <div class="h-screen mx-[1%] mt-[1%] bg-black-light rounded-3xl">
        <div class="h-full w-full flex flex-col justify-center items-center">
            <p class="font-black text-fifty-four-px text-white">
                היעד הזה בתהליך בניית מסלול
            </p>
            <p class="font-light text-twenty-seven-px text-white">
                בקרו בקרוב או השאירו פרטים
            </p>
            <div class="h-[30%] w-auto justify-self-end mt-[10%]">
                <img :src="mediaServer + mainImage" alt="" class="h-full  object-cover">
            </div>
        </div>
    </div>
    <div class="h-screen">
        <ContactMeWrapper/>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { useViewModeStore } from '@/stores/viewModeStores';
import ContactMeWrapper from './ContactMeWrapper.vue';
import { useLayoutStore } from '@/stores/layoutStore'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'

const generalCollectionStore = useGeneralCollectionStore()

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const mainImage = computed(() => {
  const doc = generalCollectionStore.document('coming_soon')
  return getImageUrlFromDoc(doc, 'background')
})
const layoutStore = useLayoutStore()
const store = useViewModeStore()


onMounted(() => {
    store.setMode("dark")
    layoutStore.setMargin("mt-[1%]", "mx-[1%]")
})

onUnmounted( () => {
    store.setMode("default")
    layoutStore.setToDefault()
})

</script>

<style>
</style>