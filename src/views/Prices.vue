<template>
    <div v-if="loading">
        <div class="flex items-center justify-center h-screen">
            <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
        </div>
    </div>
    <div v-else>
        <CustomTripDef class="mt-[8%]" language="he" title="תכנון טיולים בהתאמה אישית אי זה עובד?">
            טיול בתפירה אישית הוא בדיוק כפי שהוא נשמע – טיול שמתואם במיוחד לצרכים ולרצונות שלכם. עם ניסיון רב במגוון יעדים וסוגי טיולים, אני כאן כדי לוודא שתקבלו את החופשה המושלמת עבורכם. אין שני טיולים דומים, וכל אחד חווה טיול בדרך שונה. לכן, אני מציעה שלושה מסלולים שונים, כל אחד מהם נותן לכם את הגמישות וההתאמה האישית שאתם צריכים:
            <br><br>
    איך זה עובד שלב אחרי שלב?
    
        </CustomTripDef>
        <div class="flex items-center "
        :class="{
            'mt-[8%]' : screen.isMobile
        }"
        >
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
import { computed, onMounted } from 'vue'
import { useScreenStore } from '@/stores/screen'

import { useGeneralCollectionStore } from '@/stores/generalDocStore'
import { getImageUrlFromDoc } from '@/composables/imageUtils'
import { useViewModeStore } from '@/stores/viewModeStores'

import CustomTripDef from '@/components/CustomTripDef.vue';
import InteractiveRoadmapWrraper from '@/components/InteractiveRoadmapWrraper.vue';
import PricesCards from '@/components/PricesCards.vue';
import ContactMeWrapper from '@/components/ContactMeWrapper.vue'

const generalCollectionStore = useGeneralCollectionStore()
const { setMode } = useViewModeStore()
const screen = useScreenStore()

onMounted(() => {
    setMode('light')
})

const loading = computed(() => generalCollectionStore.isMainCollectionLoading.value )

</script>

<style>
</style>