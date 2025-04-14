<template>
    <div class="relative w-full">
      <!-- Underline that stretches from full right edge -->
      <div class="text-purple-blue font-bold flex-wrap" :class="`text-${fontSize}`">
        <slot name="title">
            {{ title }}
        </slot>
    </div>
      <div class="absolute bg-purple-blue left-0 h-[4px]  right-[calc(-1*theme(spacing.main-pad))] md:right-[calc(-1*theme(spacing.main-pad-md))]">
      </div>
  
      <!-- Title text aligned to padding -->
    </div>
</template>
  
  <script setup>
  defineProps({
    title: String,
    fontSize: {
        type: String,
        default: "fifty-four-px",
    }
  })
  </script>
  