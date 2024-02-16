<template>
  <!-- The Header -->
  <header>
    <nav class="flex flex-col items-center">
      <!-- Nav Top -->
      <div class="hidden md:block">
        <h1 class="text-4xl md:text-5xl">Calculate It!</h1>
      </div>

      <!-- Nav Bottom -->
      <div class="relative mt-3 overflow-x-hidden w-full">
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

const linksData = [
  { routeName: "math", imgSrc: "/img/calculator.svg" },
  { routeName: "bmi", imgSrc: "/img/bmi.svg" },
  { routeName: "mass", imgSrc: "/img/mass.svg" },
  { routeName: "length", imgSrc: "/img/length.svg" },
  { routeName: "time", imgSrc: "/img/time.svg" },
  { routeName: "speed", imgSrc: "/img/speed.svg" },
  { routeName: "temperature", imgSrc: "/img/temperature.svg" },
  { routeName: "currency", imgSrc: "/img/currency.svg" }
]

const route = useRoute()
</script>
