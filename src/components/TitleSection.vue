<template>
  <!--
    The parent container.
    - We use 'w-full' to make it take up the full width.
    - We use 'relative' to provide a positioning context for the underline, which is a good practice.
    - We rely on the natural block-level behavior of a div to grow with its content.
  -->
  <div class="relative w-full">
    <!--
      The title element itself.
      - 'text-purple-blue font-bold' are for styling.
      - 'flex-wrap' is not needed here; a standard div will wrap text by default.
      - We just ensure it's a block-level element and let it handle the text flow.
    -->
    <div class="text-purple-blue font-bold flex flex-wrap" :class="`text-${fontSize}`">
      <slot name="title">
          {{ title }}
      </slot>
    </div>

    <!--
      The underline div.
      - Its position is absolute, but the parent container's height is now correct,
        so it will be correctly positioned relative to the bottom of the parent.
    -->
    <div class="absolute bottom-0 left-0 h-[4px] bg-purple-blue right-[calc(-1*theme(spacing.main-pad))] md:right-[calc(-1*theme(spacing.main-pad-md))]"></div>
  </div>
</template>

<script setup>
const props = defineProps({
title: String,
fontSize: {
    type: String,
    default: "fifty-four-px",
}
})
</script>
