<template>
    <div
        class="bg-cover  w-full h-full"
        :style="{ backgroundImage: `url(${mediaServer + backgroundImage})` }">
        <div class="main-padding flex items-center h-full">
            <ContactMe/>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'

import ContactMe from './ContactMe.vue';
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'

const generalCollectionStore = useGeneralCollectionStore()

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const backgroundImage = computed(() => {
  const doc = generalCollectionStore.document('contact_me')
  if (doc) {
    return getImageUrlFromDoc(doc, 'background')
  }
  return null
})
</script>