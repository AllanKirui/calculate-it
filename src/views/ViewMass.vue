<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div
    @click="activeDropdown = 'top'"
    class="dropdown-container top-dropdown"
    :class="[activeDropdown === 'top' ? 'active' : '']"
  >
    <TheDropdown
      :is-active="activeDropdown === 'top' ? true : false"
      :active-unit="topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <h2 class="result">0</h2>
  </div>

  <!-- Bottom Units -->
  <div
    @click="activeDropdown = 'bottom'"
    class="dropdown-container bottom-dropdown"
    :class="[activeDropdown === 'bottom' ? 'active' : '']"
  >
    <TheDropdown
      :is-active="activeDropdown === 'bottom' ? true : false"
      :active-unit="bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <h2 class="result">0</h2>
  </div>

  <!-- The Output -->
  <div
    class="display-container md:min-h-[160px] h-[100px] overflow-x-hidden relative p-5 bg-liver text-sandy-brown rounded-xl"
  >
    <!-- Background Text -->
    <div class="absolute top-5 md:top-1/2 md:-translate-y-1/2">
      <span class="text-pearl-copper text-4xl sm:text-5xl md:text-7xl">{{
        $route.name
      }}</span>
    </div>
  </div>

  <!-- The Buttons -->
  <div
    ref="buttonsContainerRef"
    class="buttons-container md:min-h-full grid grid-cols-4 grid-rows-4 gap-2 text-2xl mt-3"
  >
    <!-- Row 1 Buttons -->
    <button @click="appendNumber(7)" class="btn btn-numbers">7</button>
    <button @click="appendNumber(8)" class="btn btn-numbers">8</button>
    <button @click="appendNumber(9)" class="btn btn-numbers">9</button>
    <button @click="clear('all')" class="btn btn-clear row-span-2">AC</button>

    <!-- Row 2 Buttons -->
    <button @click="appendNumber(4)" class="btn btn-numbers">4</button>
    <button @click="appendNumber(5)" class="btn btn-numbers">5</button>
    <button @click="appendNumber(6)" class="btn btn-numbers">6</button>

    <!-- Row 3 Buttons -->
    <button @click="appendNumber(1)" class="btn btn-numbers">1</button>
    <button @click="appendNumber(2)" class="btn btn-numbers">2</button>
    <button @click="appendNumber(3)" class="btn btn-numbers">3</button>
    <button @click="backspace" class="btn btn-operators row-span-2">
      &laquo;
    </button>

    <!-- Row 4 Buttons -->
    <button @click="appendNumber(0)" class="col-start-2 btn btn-numbers">
      0
    </button>
    <button @click="appendNumber('.')" class="btn btn-numbers">.</button>
  </div>
</template>

<script setup>
import TheDropdown from "@/components/ui/TheDropdown.vue"
import { ref } from "vue"

const activeDropdown = ref("top")
const topActiveUnit = ref("kg")
const bottomActiveUnit = ref("lb")

/*
  Methods
*/
const setActiveUnitTop = (unit) => {
  topActiveUnit.value = unit
}

const setActiveUnitBottom = (unit) => {
  bottomActiveUnit.value = unit
}
</script>
