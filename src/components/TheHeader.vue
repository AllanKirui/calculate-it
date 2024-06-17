<template>
  <!-- The Header -->
  <header>
    <nav class="flex flex-col items-center">
      <!-- Nav Top -->
      <div class="hidden md:block">
        <h1 class="text-4xl md:text-5xl">Calculate It!</h1>
      </div>

      <!-- Nav Bottom -->
      <div class="relative md:mt-3 pt-2 md:p-0 overflow-x-hidden w-full">
        <!-- Blurred Left & Right Edges to Hint at Horizontal Scrolling on Mobile Screens -->
        <div class="nav-blur nav-blur-left"></div>
        <div class="nav-blur nav-blur-right"></div>

        <ul
          class="links-wrapper scrollable pb-1 px-4 flex gap-4 md:justify-center md:text-lg overflow-x-auto"
          ref="navLinksContainer"
        >
          <NavLink
            v-for="link in linksData"
            :key="link.routeName"
            :route-name="link.routeName"
            :imgSrc="link.imgSrc"
          />
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

import NavLink from "./NavLink.vue"

// Import the images
import calculatorIcon from "@/assets/img/calculator.svg"
import bmiIcon from "@/assets/img/bmi.svg"
import massIcon from "@/assets/img/mass.svg"
import lengthIcon from "@/assets/img/length.svg"
import timeIcon from "@/assets/img/time.svg"
import speedIcon from "@/assets/img/speed.svg"
import temperatureIcon from "@/assets/img/temperature.svg"
import aboutIcon from "@/assets/img/about.svg"

const linksData = [
  { routeName: "math", imgSrc: calculatorIcon },
  { routeName: "bmi", imgSrc: bmiIcon },
  { routeName: "mass", imgSrc: massIcon },
  { routeName: "length", imgSrc: lengthIcon },
  { routeName: "time", imgSrc: timeIcon },
  { routeName: "speed", imgSrc: speedIcon },
  { routeName: "temperature", imgSrc: temperatureIcon },
  { routeName: "about", imgSrc: aboutIcon }
]

const route = useRoute()
const navLinksContainer = ref(null)

watch(
  () => route.name,
  (newRouteName) => {
    // scrolling the active route into view
    const navLinks = Array.from(navLinksContainer.value.children)

    // find the <li> with an <a> child containing a <span> whose the innerText
    // matches the active route name
    const activeLink = navLinks.find(
      (linkEl) =>
        linkEl.children[0].lastElementChild.innerText.toLowerCase() ===
        newRouteName
    )

    activeLink.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }
)
</script>
