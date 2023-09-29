<template>
  <!-- Global Container -->
  <div class="container h-screen max-w-4xl mx-auto">
    <div class="pt-5 md:py-10">
      <TheHeader />
      <TheCalculator />
    </div>
  </div>
</template>

<script setup>
import TheHeader from './components/TheHeader.vue';
import TheCalculator from './components/TheCalculator.vue';
</script>