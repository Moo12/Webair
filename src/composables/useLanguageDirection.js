// composables/useLanguageDirection.js
import { ref, computed } from 'vue'

export default function useLanguageDirection(initialLang = 'en') {
  const lang = ref(initialLang)

  const directionMap = {
    en: 'ltr',
    he: 'rtl',
    ar: 'rtl',
    fr: 'ltr',
    // Add more as needed
  }

  const dir = computed(() => directionMap[lang.value] || 'ltr')

  const flexDir = computed(() =>
    dir.value === 'rtl' ? 'flex-row-reverse' : 'flex-row'
  )

  const textAlign = computed(() =>
    dir.value === 'rtl' ? 'text-right' : 'text-left'
  )

  const justifyDir = computed(() =>
    dir.value === 'rtl' ? 'justify-end' : 'justify-start'
  )

  const setLanguage = (newLang) => {
    lang.value = newLang
  }

  return {
    lang,
    dir,           // 'rtl' or 'ltr'
    flexDir,       // Tailwind class: 'flex-row' or 'flex-row-reverse'
    textAlign,     // Tailwind class: 'text-left' or 'text-right'
    justifyDir,    // Tailwind class: 'justify-start' or 'justify-end'
    setLanguage
  }
}
