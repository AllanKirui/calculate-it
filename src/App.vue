<template>
  <!-- Global Container -->
  <div
    ref="appContainer"
    class="container max-w-4xl mx-auto md:py-10 relative min-h-screen"
  >
    <TheHeader />
    <TheCalculator />
  </div>
</template>

<script setup>
import TheHeader from "./components/TheHeader.vue"
import TheCalculator from "./components/TheCalculator.vue"
import { ref, onMounted } from "vue"

const appContainer = ref(null)

const adjustHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty("--vh", `${vh}px`)
  appContainer.value.style.minHeight = "calc(var(--vh, 1vh) * 100)"
}

onMounted(() => {
  window.addEventListener("resize", adjustHeight)
  adjustHeight()
})
</script>
