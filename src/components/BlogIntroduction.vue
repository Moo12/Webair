<template>
    <div v-if="loading" class="grid grid-cols-6 gap-[3.6%] right-padding w-full ">
        <div class="col-span-6 flex items-center justify-center h-full">
            <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
        </div>
    </div>
    <div v-else class="grid grid-cols-6 gap-x-[3.6%] right-padding w-full ">
        <div class="col-span-4 md:col-span-2  flex items-end justify-center h-full  ">
            <TitleSection :fontSize="screen.isMobile ? 'eighteen-px' : 'twenty-seven-px'" class="mb-[20%]">
                <template #title>
                    <router-link to="/blog">
                        מוזמנים לבלוג טיולים שלי
                    </router-link>
                </template>
            </TitleSection>
        </div>
        <!-- image scroller -->
         <div  class="relative col-span-6 md:col-span-4">
            <Scroller :items="imagesItems" :itemWidth="screen.isMobile ? 80 : 25" :itemGap="screen.isMobile ? 20 : 2">
                <template v-slot:default="{ item }">
                    <div class="absolute max-w-full w-full max-h-1/4 h-1/4 top-[67%] px-[10%] mx-auto flex flex-wrap items-center justify-center bg-white">
                        <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">{{ item.title }}</p>
                    </div> 
                </template>
            </Scroller>
        </div>
        
    </div>
</template>

<script setup>
    import { computed } from 'vue';

    import Scroller from './Scroller.vue';
    import TitleSection from './TitleSection.vue';

    import { useScreenStore } from '@/stores/screen'

    import { getImageUrlFromDoc } from '@/composables/imageUtils'
    const screen = useScreenStore()

    import { useGeneralCollectionStore } from '@/stores/generalDocStore'
    
    const generalCollectionStore = useGeneralCollectionStore()

    const loading = computed(() => generalCollectionStore.isSubCollectionLoading('destinations', 'destinations'))

    const imagesItems = computed(() => {
        const docs =  generalCollectionStore.documents('destinations')
        console.log(docs)
        return docs.map(doc => {
            return {
                image: getImageUrlFromDoc(doc, 'main'),
                title: doc.name.he || doc.name.en,
                id: doc.id,
            }
        })
    })
</script>