// src/stores/screen.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useScreenStore = defineStore('screen', () => {
  const isMobile = ref(window.innerWidth <= 768)

  function checkMobile() {
    isMobile.value = window.innerWidth <= 768
  }

  // Call this ONCE from App.vue to set up the listener
  function init() {
    window.addEventListener('resize', checkMobile)
    checkMobile()
  }

  // Optional: cleanup
  function destroy() {
    window.removeEventListener('resize', checkMobile)
  }

  return { isMobile, init, destroy }
})
