<template>
    <div v-if="loading" class="h-[80vh]">
      <div class="flex items-center justify-center">
        <p class="text-center break-words whitespace-normal md:text-[20px] text-[27px]">טוען נתונים...</p>
      </div>
    </div>
    <div v-else ref="mapContainer" class="relative w-full">
        <!-- Background Map Image -->
        <img :src="mediaServer + mapImage" alt="Map" class="w-full h-auto object-cover" />
  
        <!-- Location Icons -->
        <div
            v-for="(loc, index) in normalizedLocations"
            :key="loc.id"
            class="absolute cursor-pointer"
            :style="{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translateX(-50%) translateY(-100%)'
            }"
            @click="toggleLocation(Number(loc.id))"
            @mouseenter="hoveredLocationId = loc.id"
            @mouseleave="hoveredLocationId = null"
            >
            <img
                :src="activeLocation === Number(loc.id) ? mediaServer + activeIcon : mediaServer + inactiveIcon"
                :alt="`Location ${index + 1}`"
                class="w-8 h-8"
            />
            <div
                v-if="hoveredLocationId === loc.id"
                class="absolute left-[-120%] top-[-100%] bg-white px-2 py-1 rounded shadow z-30 whitespace-nowrap"
            >
              {{ loc.title }}
            </div>
        </div>
        
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { defineEmits } from 'vue'

  import { useGeneralCollectionStore } from '@/stores/generalDocStore'
  import { getImageUrlFromDoc } from '@/composables/imageUtils'

  const generalCollectionStore = useGeneralCollectionStore()

  const loading = computed(() => generalCollectionStore.isMainCollectionLoading.value)

  const doc_id = 'interactive_map'

  const mediaServer = process.env.VUE_APP_UPLOAD_BASE_URL

  const mapImage = computed(() => {
    const doc = generalCollectionStore.document(doc_id)
    
    if (!doc) {
      return null
    }

    const url = getImageUrlFromDoc(doc, "main")
    console.log("map main", url)
  
    return url
  })

  const activeIcon = computed(() => {
    const doc = generalCollectionStore.document(doc_id)
    if (!doc) {
      return null
    }

    return getImageUrlFromDoc(doc, "active")
  })

  const inactiveIcon = computed(() => {
    const doc = generalCollectionStore.document(doc_id)
    if (!doc) {
      return null
    }
    return getImageUrlFromDoc(doc, "inactive")
  })
  
  const emit = defineEmits(['locationToggled'])

  const props = defineProps({
    locations: {
        type: Object,
        required: true
    },
    currentLocation: {
        type: Number,
        default: 1
    }
  })
  
  // Original image dimensions
  const originalWidth = 1366
  const originalHeight = 768

  const hoveredLocationId = ref(null)
  
// Convert pixel to percentage relative to the original image size
const normalizedLocations = computed(() =>
  Object.entries(props.locations).map(([id, loc]) => ({
    id: Number(id), // <- add this line to preserve the original key
    ...loc,
    x: (loc.x / originalWidth) * 100,
    y: (loc.y / originalHeight) * 100
  }))
)

  
  const activeLocation = ref(props.currentLocation)
  
  function toggleLocation(id) {
    console.log(normalizedLocations.value)

    activeLocation.value = activeLocation.value === id ? null : id
    emit('locationToggled', activeLocation.value)
  }
  </script>
  
  <style scoped>
  /* Add hover or transition if you want */
  </style>
  