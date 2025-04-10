<template>
  <div class="z-10">
    <div class="w-full h-screen overflow-hidden">
      <img src="../../public/img/webair-aurope-capitals.jpeg" alt="" class="w-full h-full object-cover">
    </div>
    <div>
      <Introduction language="he"/>
    </div>
    <AutoScrolled/>
  </div>
</template>

<script setup>
import Introduction from '@/components/Introduction.vue';
import AutoScrolled from '@/components/AutoScrolled.vue';
</script>
