<template>
  <div class="about-wrapper">
    <!-- About Text -->
    <div class="max-w-md md:max-w-xl mx-auto">
      <h1 class="text-4xl mt-4">Calculate It!</h1>
      <p class="mt-4">
        From concept to code, creating this calculator app with
        <strong>Vue's Composition API</strong> was a rewarding journey.
      </p>
      <p class="mt-3">
        Having built previous <strong>Vue</strong> apps using the
        <strong>Options API</strong>, I wanted to gain hands-on experience with
        the <strong>Composition API</strong>.
      </p>
      <p class="mt-3">Enjoy crunching numbers as much as I did making it!</p>
    </div>

    <!-- About Links -->
    <div class="max-w-md md:max-w-xl mx-auto mt-14">
      <p>
        Designed and coded by
        <a
          class="bg-mellow-apricot px-1 hover:bg-neon-carrot duration-200 rounded"
          href="https://allanKirui.github.io"
          target="_blank"
          title="Allan's Portfolio"
          >Allan Kirui</a
        >
        in
        <a
          class="bg-mellow-apricot px-1 hover:bg-neon-carrot duration-200 rounded"
          href="https://vuejs.org"
          target="_blank"
          title="Vue.js Website"
          >Vue.js</a
        >.
      </p>
      <p class="mt-2">
        Inspired by this
        <a
          class="bg-mellow-apricot px-1 hover:bg-neon-carrot duration-200 rounded"
          href="https://play.google.com/store/apps/details?id=com.miui.calculator"
          target="_blank"
          title="Calculator App"
          >Calculator</a
        >.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, inject } from "vue"

const adjustCalculatorHeight = inject("adjustCalculatorHeight")

onMounted(() => {
  window.addEventListener("resize", adjustCalculatorHeight)
  adjustCalculatorHeight()
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", adjustCalculatorHeight)
})
</script>
