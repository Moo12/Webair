<template>
    <div class="main-padding w-full z-[99]">
        <div class=" flex items-center justify-between gap-4">
            <router-link :to="link.href" v-for="(link,i) in navItems" :key="i" class="flex-grow-0 btn inline-block"
            :class="{
                'w-[7%]' : link.imageSrc && link.imageSrc !== '' && !screen.isMobile,
                'w-[25%]' : link.imageSrc && link.imageSrc !== '' && screen.isMobile
            }">

                <div v-if="link.imageSrc" class="w-full h-auto">
                    <img :src="mediaServer + link.imageSrc" alt="nav icon" class=" w-full object-cover" />
                </div>
                <div v-else>
                    <span class="text-[14px] md:text-[18px]">{{ link.name }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useScreenStore } from '@/stores/screen'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'

const screen = useScreenStore()
const generalCollectionStore = useGeneralCollectionStore()

const homeIcon = computed(() => {
  const doc = generalCollectionStore.document('navbar')
  return getImageUrlFromDoc(doc, 'home')
})

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const navItems = computed(() => [
    {
        name: "בלוג",
        href: "/blog",
    },
    {
        name: "קצת עליי",
        href: "/about-me",
    },
    {
        name: "בית",
        href: "/",
        imageSrc: homeIcon.value // This will always be current
    },
    {
        name: "מחירון",
        href: "/prices",
    },
    {
        name: "יעדים",
        href: "/destinations",
    },
])

</script>