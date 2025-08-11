<template>
  <div v-if="loading">
    <div class="flex items-center justify-center h-screen">
      <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
    </div>
  </div>
  <div v-else>
    <WelcomeVideo :source="welcomeVideo" class="md:h-[100vh] h-auto">
      <template #default>
        <div class="text-center text-white flex flex-col gap-2">
          <p class="text-white text-center text-[36px] lg:text-[54px] font-bold">ייעוץ ותכנון טיולים</p>
          <p class="text-white text-center text-[24px] lg:text-[36px] font-medium">בהתאמה אישית</p>
        </div>
      </template>
    </WelcomeVideo>
    <div class="md:mt-[8%] mt-[15%]">
      <Introduction language="he" title="תכנון טיולים בהתאמה אישית מה זה אומר?">
        <p>בין אם אתם חולמים על חופשה אורבנית תוססת, טבע עוצמתי, חוויות קולינריות או שילוב של כל אלה, אני כאן כדי להפוך את החלום שלכם למסלול מדויק, נוח וזורם. 
          <br><br>
          אני מאמינה שטיול טוב מתחיל בתכנון אישי – יצירה ייחודית, המבוססת על ההעדפות שלכם, הקצב שמתאים לכם והקסם שמסתתר בכל פינה בעולם. ב-WEBAIR, כל מסע נבנה בדיוק בשבילכם – משלב הרעיון ועד הפרטים הקטנים. 
          <br><br>
          אני חוקרת עבורכם את היעד, מסננת את כל המידע ומאתרת את המקומות הקסומים באמת – נקודות שאסור לפספס, שבילים נסתרים, בתי קפה ויקבים מיוחדים, תרבות מקומית ועוד הפתעות. עם הקפדה על הפרטים שחשובים לכם, אבנה עבורכם מסלול יומי נוח וגמיש, כולל כל הנקודות החשובות בתיאור ועל המפה, כך שתוכלו להנות מהטיול בקצב שלכם וליצור חוויות בלתי נשכחות.
        </p>
      </Introduction>
    </div>
    <div class="flex items-center md:mt-[8%] mt-[15%]">
      <AutoScrolled :images="images" :imagePercentage="screenStore.isMobile ? 100 : 50" :scrollSpeed="3">
        <template #default="{ item }">
          <router-link :to="{ name: 'Destination', params: {id: item.id}}" class="h-full w-full flex justify-center items-end mb-5">
            <p class=" text-white font-black text-[20px]">{{ item.title }}</p>
          </router-link>
        </template>
      </AutoScrolled>
    </div>

    <div class="md:mt-[8%] mt-[15%] flex items-center">
      <NewAdventure/>
    </div>

    <div id="about-me" class="flex items-center md:mt-[8%] mt-[15%]">
      <AboutMe/>
    </div>  

    <div class="md:mt-[8%] mt-[15%] flex items-center">
      <BlogIntroduction/>
    </div>
    <div id="contact-me" class="h-[85vh] mt-[8%] flex items-center">
      <ContactMeWrapper/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { getImageUrlFromDoc } from '@/composables/imageUtils'
import { useScreenStore } from '@/stores/screen'

import Introduction from '@/components/CustomTripDef.vue';
import AutoScrolled from '@/components/AutoScrolled.vue';
import NewAdventure from '@/components/NewAdventure.vue';
import AboutMe from '@/components/AboutMe.vue';
import BlogIntroduction from '@/components/BlogIntroduction.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue';
import WelcomeVideo from '@/components/WelcomeVideo.vue';

import { useGeneralCollectionStore } from '@/stores/generalDocStore'

const generalCollectionStore = useGeneralCollectionStore()

const screenStore = useScreenStore()

const loading = computed(() => { 
  return generalCollectionStore.isSubCollectionLoading('destinations', 'destinations') 
  || generalCollectionStore.isMainCollectionLoading.value || !welcomeVideo.value
})

const images = computed(() => {
  const docs = generalCollectionStore.documents('destinations')
  return docs.map(doc => {
    return {
      src: getImageUrlFromDoc(doc, 'main'),
      title: doc.name.he || doc.name.en,
      id: doc.id,
    }
  })
})

const welcomeVideo = computed(() => {
  const doc = generalCollectionStore.document('welcome')
  
  if (doc) {
    return getImageUrlFromDoc(doc, 'main')
  }

  return null
})

</script>
