// stores/layout.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const mt = ref('mt-0')
  const mx = ref('mx-0')

  const mt_default = 'mt-0'
  const mx_default = 'mx-0'


  function setMargin(top, sides) {
    if (top) mt.value = top
    if (sides) mx.value = sides
  }

  const setToDefault = () => {
    mt.value = mt_default
    mx.value = mx_default
  }

  return {
    mt,
    mx,
    setMargin,
    setToDefault,
  }
})
