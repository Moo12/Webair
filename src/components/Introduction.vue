<template>
    <div class="h-full flex relative">

        <div class="absolute bottom-0 left-0 bg-cover flex items-center z-[0]">
            <img src="/img/webair_introduction_background.png" alt="" class="object-top z-[0] object-cover w-full">
        </div>
        <div class="grid grid-cols-6 gap-[3.6%] main-padding z-[10]" :class="textAlign">
            <div class="col-span-2 text-fifty-four-px text-black text-center flex items-center h-full ">
                <TitleSection title="תכנון טיולים אישית מה זה אומר?"/>
            </div>
            <div class="col-span-4 flex flex-col text-twenty-seven-px justify-center">
                <p class="w-full">בין אם אתם חולמים על חופשה אורבנית תוססת, טבע עוצמתי, חוויות קולינריות או שילוב של כל אלה, אני כאן כדי להפוך את החלום שלכם למסלול מדויק, נוח וזורם. 
                    <br><br>
                    אני מאמינה שטיול טוב מתחיל בתכנון אישי – יצירה ייחודית, המבוססת על ההעדפות שלכם, הקצב שמתאים לכם והקסם שמסתתר בכל פינה בעולם. ב-WEBAIR, כל מסע נבנה בדיוק בשבילכם – משלב הרעיון ועד הפרטים הקטנים. 
                    <br><br>
                    אני חוקרת עבורכם את היעד, מסננת את כל המידע ומאתרת את המקומות הקסומים באמת – נקודות שאסור לפספס, שבילים נסתרים, בתי קפה ויקבים מיוחדים, תרבות מקומית ועוד הפתעות. עם הקפדה על הפרטים שחשובים לכם, אבנה עבורכם מסלול יומי נוח וגמיש, כולל כל הנקודות החשובות בתיאור ועל המפה, כך שתוכלו להנות מהטיול בקצב שלכם וליצור חוויות בלתי נשכחות.
    
                </p>
            </div>
    
        </div>
    </div>

</template>

<script setup>
import useLanguageDirection from "@/composables/useLanguageDirection"
import TitleSection from "./TitleSection.vue"

const props = defineProps({
    language: {
      type: String,
      required: true
    }
})

const { textAlign } = useLanguageDirection(props.language)

</script>

<style>

</style>