<template>
    <div class="grid grid-cols-12  main-padding" :class="textAlign">
        <div class="col-span-6 text-fifty-four-px text-black text-center flex items-center h-full ">
            <p>
                תכנון טיולים אישית מה זה אומר?
            </p>
        </div>
        <div class="col-span-6 flex flex-col text-twenty-seven-px justify-between">
            <p class="w-full">בין אם אתם חולמים על חופשה אורבנית תוססת, טבע עוצמתי, חוויות קולינריות או שילוב של כל אלה, אני כאן כדי להפוך את החלום שלכם למסלול מדויק, נוח וזורם. 
            </p><br>
            <p class="w-full">
                אני מאמינה שטיול טוב מתחיל בתכנון אישי – יצירה ייחודית, המבוססת על ההעדפות שלכם, הקצב שמתאים לכם והקסם שמסתתר בכל פינה בעולם. ב-WEBAIR, כל מסע נבנה בדיוק בשבילכם – משלב הרעיון ועד הפרטים הקטנים. 
            </p><br>
            <p class="w-full">
                אני חוקרת עבורכם את היעד, מסננת את כל המידע ומאתרת את המקומות הקסומים באמת – נקודות שאסור לפספס, שבילים נסתרים, בתי קפה ויקבים מיוחדים, תרבות מקומית ועוד הפתעות. עם הקפדה על הפרטים שחשובים לכם, אבנה עבורכם מסלול יומי נוח וגמיש, כולל כל הנקודות החשובות בתיאור ועל המפה, כך שתוכלו להנות מהטיול בקצב שלכם וליצור חוויות בלתי נשכחות.

            </p>
        </div>

    </div>

</template>

<script setup>
import useLanguageDirection from "@/composables/useLanguageDirection"

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