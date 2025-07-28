// src/stores/navbarMode.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewModeStore = defineStore('viewMode', () => {
  const defaultMode = 'light'
  const mode = ref(defaultMode); // default mode

  function setMode(newMode) {
    mode.value = newMode === 'default' ? defaultMode : newMode
  }

  return { mode, setMode };
});
