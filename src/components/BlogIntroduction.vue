<template>
    <div class="grid grid-cols-6 gap-[3.6%] main-padding w-full">
        <div class="col-span-2  flex items-end justify-center h-full ">
            <TitleSection title="מוזמנים לבלוג טיולים שלי" fontSize="twenty-seven-px"/>
        </div>
        <!-- image scroller -->
         <div class="relative col-span-4">
             <div class="absolute right-0  left-[calc(-1*theme(spacing.main-pad))] md:left-[calc(-1*theme(spacing.main-pad-md))]">
                 <Scroller :items="items" :itemWidth="25" :itemGap="2">
                     <template v-slot:default="{ item }">
                         <div class="absolute max-w-full w-full max-h-1/4 h-1/4 top-[67%] px-[10%] mx-auto flex flex-wrap items-center justify-center bg-white">
                             <p class="text-center break-words whitespace-normal ">{{ item.title }}</p>
                         </div> 
                     </template>
                 </Scroller>
             </div>
         </div >
    </div>
</template>

<script setup>
    import Scroller from './Scroller.vue';
    import TitleSection from './TitleSection.vue';
    import vietnam from '@/../public/img/webair-vietnam.jpg'
    import cyprus from '@/../public/img/webair-cyprus.jpg'

    const items = [
    {
        image: vietnam,
        title: "Vietnam",
        id: 1,
    },
    {
        image: cyprus,
        title: "Cyprus",
        id: 2,

    },
    {
        image: vietnam,
        title: "Vietnam",
        id: 3,
    },
    {
        image: cyprus,
        title: "Cyprus",
        id: 4,
    },
    {
        image: vietnam,
        title: "Vietnam",
        id: 5,
    },
    {
        image: cyprus,
        title: "Cyprus",
        id: 6,
    },
    ]


</script>