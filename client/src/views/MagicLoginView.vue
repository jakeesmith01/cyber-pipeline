<template>
    <div>
      <h1>Logging you in...</h1>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTokenStore } from '@/stores/Token';
  
  const errorMessage = ref('');
  const tokenStore = useTokenStore();
  
  // Get the token from the URL search params
  const getTokenFromUrl = () => {
    console.log("Getting token from url")
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token'); // Assuming the token is passed as a query param
  };
  
  onMounted(async () => {
    const token = getTokenFromUrl(); // Get the magic link token from the URL
  
    if (token) {
      try {
        await tokenStore.verifyMagicLink(token); // Verify the magic link using the tokenStore
      } catch (error) {
        errorMessage.value = 'Error verifying the magic link. Please try again.'; // Show error message
      }
    } else {
      errorMessage.value = 'No token found in the URL. Please try again.'; // Handle the case where no token is present
    }
  });
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>
  