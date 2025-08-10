<template>
  <div v-if="isLoading">
    <div class="flex items-center justify-center h-screen">
      <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
    </div>
  </div>
  <div v-else class="grid grid-cols-12  w-full textAlign main-padding"
  :class="{
    'gap-y-20' : screen.isMobile,
    'gap-x-3' : !screen.isMobile
  }"
  >
    <div class="col-span-12 md:col-span-4 min-h-[30vh] flex flex-col gap-4 justify-center">
        <div class="flex items-center w-full gap-4 ">
            <div class="w-[20%] h-auto">
                <img :src="mediaServer + icon_hover" alt="Map location icon" class="w-full h-full object-cover">
            </div>
            <div class="text-twenty-seven-px font-black">
                {{ currentInfo?.title }}
            </div>
        </div>
        <div class="text-eighteen-px">
            {{ currentInfo?.content }}
        </div>
    </div>
    <div class="col-span-12 md:col-span-8 flex items-center">
        <InteractiveRoadmap :locations="readMapInfo" :currentLocation="currentLocationId" :title="currentInfo?.title" @locationToggled="handleLocationToggled" />
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from 'vue';
import InteractiveRoadmap from './InteractiveRoadmap.vue';
import useLanguageDirection from "@/composables/useLanguageDirection"
import { useScreenStore } from '@/stores/screen'
import { useGeneralCollectionStore } from '@/stores/generalDocStore'

const generalCollectionStore = useGeneralCollectionStore()

const screen = useScreenStore()

import { getImageUrlFromDoc } from '@/composables/imageUtils'

const props = defineProps({
    language: {
      type: String,
      required: true
    }
})

const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

const isLoading = computed(() => generalCollectionStore.isMainCollectionLoading.value)

const icon_hover = computed(() => {
  if (isLoading.value) {
    return null
  }
  const doc = generalCollectionStore.document('interactive_map')
  return getImageUrlFromDoc(doc, "inactive")
})

const currentLocationId = ref(1)

const { textAlign } = useLanguageDirection(props.language)

const readMapInfo = {
  1: {
    x: 970,
    y: 112,
    title: "שיחת היכרות ראשונית",
    content: "אנחנו מתחילים בשיחה, בה נכיר את היעד, נאפיין את הרצונות שלכם ואדאג ללמוד יותר עליכם: מה אתם אוהבים, מה חשוב לכם בחופשה, ומהן הציפיות שלכם מהטיול.",
  },
  2: {
    x: 704,
    y: 185,
    title: "תכנון מסלול אופרטיבי",
    content: "לאחר ההיכרות, אבנה לכם תכנית מסלול יומית מפורטת הכוללת את האתרים, האטרקציות והמלונות, עם טיפים ודרכים לשדרג את החופשה. אם יש צורך, נעבור על הדגשים ונתאים את המסלול.",
  },
  3: {
    x: 368,
    y: 225,
    title: "קבלת תכנית מפורטת",
    content: "אחרי שתאשרו את התכנית, אכין לכם את התכנית הסופית, עם כל הפרטים – טיסות, לינה, מסלולי נסיעה והליכה, מפות אינטראקטיביות והמלצות נוספות.",
  },
  4: {
    x: 382,
    y: 576,
    title: "מפגש הכנה",
    content: "אני אוהבת להכיר את הלקוחות שלי! נקבע פגישה נוספת בה נוודא שהכל מדויק ונשב על הדיוקים האחרונים של היעד והמסלול.",
  },
  5: {
    x: 697,
    y: 425,
    title: "ליווי עד הטיסה ובזמן הטיול",
    content: "אתם לא לבד! במהלך ההכנות וגם בזמן הטיול, אני זמינה לכל שאלה או התייעצות.",
  },
  6: {
    x: 1037,
    y: 581,
    title: "פידבק אחרי הטיול",
    content: "אחרי החופשה, אני אשמח לשמוע איך היה לכם – ממה נהניתם ומה אפשר לשפר. חשוב לי להמשיך לשפר ולהתאים את השירות ללקוחות הבאים.",
  }
}

const currentInfo = computed(() => readMapInfo[currentLocationId.value] || {});

const handleLocationToggled = (id) => {
    console.log("id: ", id)
    currentLocationId.value = id
}


</script>