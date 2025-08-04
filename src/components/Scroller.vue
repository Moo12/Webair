<template>
  <div class="scroll-component-wrapper">
    <div class="scroll-container">
      <div
        class="flex flex-nowrap overflow-x-scroll scroll-smooth whitespace-nowrap w-full scroll-wrapper"
        :style="{ gap: gapSize, minWidth: '100%' }"
        ref="scrollWrapper"
        @scroll="handleScroll"
      >
        <div
          v-for="(item, index) in items" 
          :key="index" 
          class="shrink-0 aspect-[1.5] bg-cover bg-center flex items-center justify-center relative rounded-[30px] overflow-hidden cursor-pointer"
          :style="{ backgroundImage: `url(${imageServer}${item.image})`, width:  scrollItemWidth}"
        >
           <!-- Default slot for custom content -->
           <slot :item="item"></slot>
          </div>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div class="flex justify-center items-center mt-4">
      <div 
        v-for="(item, index) in items" 
        :key="index" 
        class="w-3 h-3 rounded-full mx-1 cursor-pointer transition-all duration-100 ease-in-out"
        :class="{'bg-gray-400': activeIndex !== index, 'bg-purple-blue w-4 h-4': activeIndex === index}"
        @click="scrollToItem(index)"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    itemWidth: {
      type: Number,
      required: false,
      default: 25
    },
    itemGap: {
      type: Number,
      required: false,
      default: 2
    }
  },
  setup(props) {
    const scrollWrapper = ref(null);
    const scrollItemWidth = ref(`${props.itemWidth}%`);// Width of each scroll item
    const gapSize = ref(`${props.itemGap}%`); // Gap between scroll items in px
    const activeIndex = ref(0);
    let isScrolling = null;

    const imageServer = process.env.VUE_APP_UPLOAD_BASE_URL

    console.log(props.items)
    console.log(`item percentage ${scrollItemWidth.value} gap percentage ${gapSize.value}`)

    // Compute scroll step (item width + gap)
    const parsePercentage = (percentStr) => parseFloat(percentStr) / 100;

    const scrollStep = computed(() => {
      if (!scrollWrapper.value) return 0;
      const containerWidth = scrollWrapper.value.getBoundingClientRect().width;
      const itemW = containerWidth * parsePercentage(props.itemWidth);
      const gap = containerWidth * parsePercentage(props.itemGap);

      console.log(`itemW ${itemW} gap ${gap}`)
      return itemW + gap;
    });

    const handleScroll = () => {
      if (scrollWrapper.value && scrollStep.value > 0) {
        const scrollPosition = scrollWrapper.value.scrollLeft;
        // Calculate the closest item index without debounce
        const calculatedIndex = Math.round(scrollPosition / scrollStep.value) * -1;
        
        activeIndex.value = Math.max(0, Math.min(calculatedIndex, props.items.length - 1));
      }
    };
  
    const scrollLeft = () => {
      if (scrollWrapper.value) {
        scrollWrapper.value.scrollBy({ left: -scrollStep.value, behavior: "smooth" });
      }
    };
  
    const scrollRight = () => {
      if (scrollWrapper.value) {
        scrollWrapper.value.scrollBy({ left: scrollStep.value, behavior: "smooth" });
      }
    };

    onMounted(() => {
      // Initialize activeIndex
      activeIndex.value = 0;
    });
  
      return { 
        scrollWrapper, 
        scrollLeft, 
        scrollRight, 
        scrollItemWidth, 
        gapSize, 
        imageServer, 
        activeIndex,
        handleScroll
      };
    }
  };
  </script>

<style scoped>
.scroll-component-wrapper {
  width: 100%;
  overflow: hidden;
}
.scroll-container {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: auto;
}

.scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.scroll-wrapper {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.bg-purple-blue {
    background-color: #7B68EE;
}
</style>
