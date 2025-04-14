<template>
    <div class="grid grid-cols-6 gap-[3.6%] main-padding" :class="textAlign">
        <div class="col-span-3 flex flex-col gap-8 justify-end h-full items-center">
            <TitleSection title="היי, נעים להכיר" fontSize="twenty-seven-px"/>
            <p class="text-eighteen-px leading-loose">אני איריס, טיילת מלידה, חוקרת עולמות קרובים ורחוקים מתוך תשוקה אמיתית לגלות, לחוות ולשתף. עם רקע כביולוגית ימית וחקר המוח וההתנהגות, אני מוצאת קסם בטבע, בתרבויות ובמפגשים בלתי נשכחים. אחרי אינספור מסעות – ממעמקי השונית הגדולה באוסטרליה, דרך פסגות ההימלאיה ועד מדבריות הסהרה הבנתי שטיול טוב באמת מתחיל בתכנון אישי. מתוך אהבה לעולם ולבני אדם הקמתי את WEBAIR , כדי לעזור לכם ליצור טיולים שתפורים בדיוק עבורכם – לחוויות, לחלומות ולרגעים שיישארו אתכם הרבה אחרי שתחזרו הביתה. </p>
        </div>
        <div class="col-span-3 flex flex-col text-twenty-seven-px justify-center">
            <img src="img/webair_aboutme_background.jpg" class="object-cover aspect-square rounded-3xl" alt="">
        </div>

    </div>


</template>

<script setup>
import useLanguageDirection from "@/composables/useLanguageDirection";

import TitleSection from './TitleSection.vue';

const { textAlign } = useLanguageDirection("he")


</script>