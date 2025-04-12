<template>
    <div class="w-full relative" 
        :style="{height: `${mapHeight * 1.5}px`}">
        <div class="grid grid-cols-6 gap-[3.6%] main-padding">
            <div class="col-span-2 ">
                <div class="h-[50%] flex items-end pb-1">

                    <TitleSection class="z-[10]" title="מה ההרפתקאה הבאה שלך?"  fontSize="twenty-seven-px" />
                </div>

            </div>

            <div class="col-span-4 overflow-hidden rounded-3xl z-[10]">
                <img ref="mapImage" src="img/webair_map_homepage.png" alt="" class="w-full object-cover"  @load="updateMapHeight">
            </div>
        </div>
        <!-- Background image positio   ned halfway down the map image -->
        <div
        class="absolute w-full object-cover bg-center z-[9]"
        :style="{
            top: '33.3%',
            height: `${mapHeight}px`,
            backgroundImage: `url('img/webair_next_adventure_background.png')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }"
        ></div>

    </div> 
</template>

<script setup>
import { ref } from 'vue'
import TitleSection from './TitleSection.vue'

const mapImage = ref(null)
const mapHeight = ref(0)

const updateMapHeight = () => {
  if (mapImage.value) {
    mapHeight.value = mapImage.value.clientHeight
  }
}
</script>

<style scoped>
</style>
  