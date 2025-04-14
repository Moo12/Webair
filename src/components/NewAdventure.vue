<template>
    <div class="w-full relative" 
        :style="{height: `${mapWrapHeight * 1.5}px`}">
        <div class="grid grid-cols-6 gap-[20%] main-padding">
            <div class="col-span-2 ">
                <div class="h-[50%] flex items-end pb-1">
                    <TitleSection class="z-[10]" title="מה ההרפתקאה הבאה שלך?"  fontSize="twenty-seven-px" />
                </div>

            </div>

            <div ref="mapWrap" class="col-span-4 flex items-end overflow-hidden rounded-3xl z-[10] bg-black-light aspect-[1.5]">
                <img src="img/webair_map.png" alt="" class="h-auto px-[6.6%] object-cover">
            </div>
        </div>
        <!-- Background image positio   ned halfway down the map image -->
        <div
        class="absolute w-full object-cover bg-center z-[9]"
        :style="{
            top: '33.3%',
            height: `${mapWrapHeight}px`,
            backgroundImage: `url('img/webair_new_advanture_package.jpg')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom'
        }"
        ></div>

    </div> 
</template>

<script setup>
import { ref, computed} from 'vue'
import TitleSection from './TitleSection.vue'

const mapWrap = ref(null)

const mapWrapHeight = computed(() => {
  if (mapWrap.value) {
    return mapWrap.value.offsetHeight
  }

  return 0
})
</script>

<style scoped>
</style>
  