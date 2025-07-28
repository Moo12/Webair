<template>
  <ComingSoon/>
</template>

<script setup>
import ComingSoon from '@/components/ComingSoon.vue';

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
})

</script>