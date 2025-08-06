<template>
  <div v-if="loading">
    <div class="flex items-center justify-center h-screen">
      <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
    </div>
  </div>
  
  <div v-else class=" h-full w-full bg-cover flex items-center"
          :style="{ backgroundImage: `url(${mediaServer + backgroundImage})` }">
      <div class="grid grid-cols-6 main-padding w-full justify-center items-center h-full pb-[4%]"
          :class="{
            'gap-y-8' : screen.isMobile
          }"
          >            
          <div class="lg:col-span-1 md:col-span-2 col-span-4 font-bold">
              <TitleSection title="בחרו את המסלול שמתאים לכם" fontSize="twenty-seven-px"/>
          </div>

          <div class="col-span-6 grid grid-cols-6 h-full"
          :class="{
            'gap-[3.6%]' : !screen.isMobile,
            'gap-y-8' : screen.isMobile
          }"
          >
            <div class="md:col-span-2 col-span-6 p-4 border bg-white rounded-3xl" v-for="card,index in travelServices" :key="index">
                <div class="flex flex-col justify-between gap-4 h-full">
                    <div class="flex flex-col gap-5 text-[22px]">
                        <div class="flex flex-col items-center ">
                            <p class="font-black"> {{ card.title }}</p>
                            <p> ({{  card.sub }})</p>
                        </div>
                        <p>{{card.content.main}}</p>
                        <div>
                            <p>מה כלול:</p>
                            <div v-for="option,index in card.content.options" :key="index" class="flex">
                                <p> {{ option }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-yellow-orange flex mb-[10%] justify-center items-center px-5 py-4 font-bold rounded-3xl text-black-light mx-auto">
                        <p>{{ card.price }} ש״ח</p>
                    </div>
                </div>
            </div>

          </div>
  
      </div>
  </div>

</template>

<script setup>
import { computed } from 'vue'
import  { useScreenStore } from '@/stores/screen'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'
import TitleSection from './TitleSection.vue';
import useLanguageDirection from "@/composables/useLanguageDirection"

const props = defineProps({
    language: {
      type: String,
      required: true
    }
})

const screen = useScreenStore()

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const generalCollectionStore = useGeneralCollectionStore()

const loading = computed(() => generalCollectionStore.isMainCollectionLoading.value)

const backgroundImage = computed(() => {
  const doc = generalCollectionStore.document('prices_cards')
  if (doc) {
    return getImageUrlFromDoc(doc, 'background')
  }
  return null
})


const { textAlign } = useLanguageDirection(props.language)


const travelServices = [
  {
    title: "שעת ייעוץ ממוקדת",
    sub: "אני רק שאלה",
    content: {
      main: "רוצים להבין איך הכי נכון לבנות את הטיול שלכם?",
      options: [
        "✔ שיחה של שעה",
        "✔ אפיון היעד וצרכים אישיים",
        "✔ טיפים והכוונה לבניית מסלול"
      ]
    },
    price: "500",
  },
  {
    title: "תכנון מסלול מדויק ומפורט",
    sub: "האופציה הפופולרית ביותר!",
    content: {
      main: "בניית מסלול יומי הכולל את כל הפרטים הקטנים.",
      options: [
        "✔ שיחת היכרות ראשונית",
        "✔ תכנון מסלול יומי מפורט",
        "✔ מפה אינטראקטיבית לנוחות",
        "✔ שיחת סיכום ודיוק סופי",
        "✔ ליווי וזמינות לכל שאלה עד ובמהלך הטיול"
      ]
    },
    price: "150"
  },
  {
    title: "שירות מורחב",
    sub: "כולל ליווי בהזמנת טיסות ולינה",
    content: {
      main: "למי שרוצה חוויה ללא דאגות.",
      options: [
        "✔ כל מה שמופיע באופציה 2",
        "✔ ליווי בהזמנת טיסות",
        "✔ עזרה בבחירת מלונות ושירותי לינה",
        "✔ התאמת ההזמנות למסלול"
      ]
    },
    price: ""
  }
];

</script>

<style>
</style>