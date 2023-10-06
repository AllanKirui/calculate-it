<template>
  <!-- Global Container -->
  <div class="container h-screen max-w-4xl mx-auto md:py-10">
    <TheHeader />
    <TheCalculator />
  </div>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue';
import TheCalculator from './components/TheCalculator.vue';
</script>