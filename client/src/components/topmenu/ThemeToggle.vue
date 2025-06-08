<script setup>
// https://dev.to/tqbit/create-your-own-dark-mode-toggle-component-with-vue-js-1284
// https://primevue.org/theming/#switchthemes

// Libraries
import { onMounted, ref } from 'vue'
import { usePrimeVue } from 'primevue/config'
const PrimeVue = usePrimeVue()
import Logger from 'js-logger'

// Theme reference
const themeDark = ref(false)

/**
 * Determine the dark mode status on component mount.  
 * It should be true if any of the following cases:
 * - The user set a browser preference for dark color schemes
 * - The user previously toggled dark mode in this app, setting a value of 'dark' in localStorage
 * Note that it is important that if a preference for light is set in local storage, it overrides
 * the browser color scheme preference!
 */
onMounted(() => {
  // check for preference in localStorage
  switch(localStorage.getItem('user-theme'))
  {
    case 'dark': 
      themeDark.value = true;
      updateTheme()
      break;
    case 'light':
      themeDark.value = false;
      updateTheme()
      break;
    default:
      // if we fall through, check for preference in matchMedia
      // Also need to account for the lack of the matchMedia API, as not all browsers support it
      if(window.matchMedia) {
        // check for media preference for dark color schemes
        if(window.matchMedia('(prefers-color-scheme: dark)').matches) themeDark.value = true;
      }
  }  
})

/**
 * Update theme on change
 */
const updateTheme = () => {
  Logger.info('Update theme to ' + themeDark.value)
  document.documentElement.classList.toggle('app-dark')
  localStorage.setItem('user-theme', themeDark.value ? 'dark' : 'light')
}

/**
 * Toggle theme value and trigger update
 */
const toggleDarkMode = () => {
  themeDark.value = !themeDark.value
  updateTheme()
}
</script>

<template>
  <div class="p-menuitem">
    <div class="p-menuitem-content">
      <a
        class="p-menuitem-link"
        @click="toggleDarkMode()"
      >
        <span
          v-if="themeDark"
          class="pi pi-sun"
          v-tooltip.bottom="'Toggle Light Mode'"
        />
        <span
          v-else
          class="pi pi-moon"
          v-tooltip.bottom="'Toggle Dark Mode'"
        />
      </a>
    </div>
  </div>
</template>

<style scoped></style>
