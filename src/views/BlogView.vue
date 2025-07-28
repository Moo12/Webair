<template>
    <div class="">
        <WelcomeVideo v-if="welcomeVideo && welcomeVideo !== ''" :source="welcomeVideo" />
        <div class="h-min-[100vh] py-[10%] relative px-[10%] w-full max-w-full">
            <div class="grid grid-cols-6 gap-10 w-full relative">
                <!-- Title: spans all columns -->
                <div class="col-span-6 absolute inset-0 text-5xl top-4 md:text-6xl font-bold mb-4 z-20 text-center">
                ההרפתקה הבאה מתחילה כאן
                </div>
                <!-- Image: overlays title, lower z-index -->
                <!-- Subheadline and Paragraph: stacked below title -->
                <div class="col-span-3  flex flex-col z-20 items-center justify-end gap-6 h-full pb-4">
                    <TitleSection class="w-[20%] self-start">
                        <template #title>
                            <div class="text-[27px]">
                                היי, נעים להכיר
                            </div>
                        </template>
                    </TitleSection>
                    
                    <p class="text-md leading-relaxed font-light">
                        
אני איריס, טיילת מלידה, חוקרת עולמות קרובים ורחוקים מתוך תשוקה אמיתית לגלות, לחוות ולשתף. עם רקע כביולוגית ימית וחקר המוח וההתנהגות, אני מוצאת קסם בטבע, בתרבויות ובמפגשים בלתי נשכחים. אחרי אינספור מסעות – ממעמקי השונית הגדולה באוסטרליה, דרך פסגות ההימלאיה ועד מדבריות הסהרה הבנתי שטיול טוב באמת מתחיל בתכנון אישי. מתוך אהבה לעולם ולבני אדם הקמתי את WEBAIR , כדי לעזור לכם ליצור טיולים שתפורים בדיוק עבורכם – לחוויות, לחלומות ולרגעים שיישארו אתכם הרבה אחרי שתחזרו הביתה. 
                    </p>
                </div>
                <div class="col-span-3 flex justify-center  z-10 pointer-events-none">
                    <img
                        :src="mediaServer + mainImage"
                        alt="איריס בטבע"
                        class="rounded-[40px] w-full h-auto max-h-[85vh] object-cover"
                        style="margin: 0 auto;"
                    />
                </div>
            </div>
        </div>
 </div>
</template>
<script setup>
import { computed } from 'vue'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'
import WelcomeVideo from '@/components/WelcomeVideo.vue';
import TitleSection from '@/components/TitleSection.vue';

const generalCollectionStore = useGeneralCollectionStore()

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const mainImage = computed(() => {
  const doc = generalCollectionStore.document('blog')
  return getImageUrlFromDoc(doc, 'main')
})

const welcomeVideo = computed(() => {
  const doc = generalCollectionStore.document('blog')
  const url = getImageUrlFromDoc(doc, 'welcome_video')
  console.log(url)
  
  return url
})
</script>

<style>
</style>