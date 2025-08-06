<template>
    <div v-if="loading">
        <div class="flex items-center justify-center h-screen">
            <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
        </div>
    </div>
    <div v-else>
        <WelcomeVideo :source="welcomeVideo">
            <template #default>
                <div class="text-center text-white flex flex-col gap-2">
                    <p class="text-white text-center text-[54px] font-bold">בחרו את המסלול</p>
                    <p class="text-white text-center text-[36px] font-medium">המתאים לכם</p>
                </div>
            </template>
        </WelcomeVideo>
        <CustomTripDef class="mt-[8%]" language="he" title="תכנון טיולים בהתאמה אישית אי זה עובד?">
            טיול בתפירה אישית הוא בדיוק כפי שהוא נשמע – טיול שמתואם במיוחד לצרכים ולרצונות שלכם. עם ניסיון רב במגוון יעדים וסוגי טיולים, אני כאן כדי לוודא שתקבלו את החופשה המושלמת עבורכם. אין שני טיולים דומים, וכל אחד חווה טיול בדרך שונה. לכן, אני מציעה שלושה מסלולים שונים, כל אחד מהם נותן לכם את הגמישות וההתאמה האישית שאתם צריכים:
            <br><br>
    איך זה עובד שלב אחרי שלב?
    
        </CustomTripDef>
        <div class="flex items-center mt-[20%] md:mt-[8%] h-[80vh]">
            <InteractiveRoadmapWrraper language="he"/>
        </div>
        <div class="mt-[20%] md:mt-[8%]">
            <PricesCards/>
        </div>
        <div class="h-[80vh] mt-[20%] md:mt-[8%]">
            <ContactMeWrapper/>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'

import CustomTripDef from '@/components/CustomTripDef.vue';
import InteractiveRoadmapWrraper from '@/components/InteractiveRoadmapWrraper.vue';
import PricesCards from '@/components/PricesCards.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue'
import WelcomeVideo from '@/components/WelcomeVideo.vue'


const generalCollectionStore = useGeneralCollectionStore()

const loading = computed(() => generalCollectionStore.isMainCollectionLoading.value || !welcomeVideo.value)

const welcomeVideo = computed(() => {
  const doc = generalCollectionStore.document('welcome')
  
  if (doc) {
    const url = getImageUrlFromDoc(doc, 'main')
    console.log("welcome video", url)
    return url
  }

  return null
})

</script>

<style>
</style>