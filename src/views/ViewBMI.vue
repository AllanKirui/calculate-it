<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div @click="closeBmiResults" class="dropdown-container top-dropdown">
    <TheDropdown
      :calc-units="weightUnits"
      unit-type="Weight"
      :is-active="activeDropdown === 'top' ? true : false"
      :active-unit="bmiData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <div @click="activeDropdown = 'top'" class="relative w-full text-right">
      <h2
        class="result"
        :class="[
          activeDropdown === 'top' ? 'active' : '',
          bmiData.topUnitValue && bmiData.topUnitValue.length > 20
            ? 'text-2xl'
            : ''
        ]"
      >
        {{ bmiData.topUnitValue || bmiData.defaultResult }}
      </h2>
      <span class="absolute right-0 text-xs md:text-sm">{{ topUnitName }}</span>
    </div>
  </div>

  <!-- Bottom Units -->
  <div @click="closeBmiResults" class="dropdown-container bottom-dropdown">
    <TheDropdown
      :calc-units="heightUnits"
      unit-type="Height"
      :is-active="activeDropdown === 'bottom' ? true : false"
      :active-unit="bmiData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <div @click="activeDropdown = 'bottom'" class="relative w-full text-right">
      <h2
        class="result"
        :class="[
          activeDropdown === 'bottom' ? 'active' : '',
          bmiData.bottomUnitValue && bmiData.bottomUnitValue.length > 20
            ? 'text-2xl'
            : ''
        ]"
      >
        {{ bmiData.bottomUnitValue || bmiData.defaultResult }}
      </h2>
      <span class="absolute right-0 text-xs md:text-sm">{{
        bottomUnitName
      }}</span>
    </div>
  </div>

  <!-- The Output -->
  <div class="display-container">
    <!-- Background Text -->
    <div class="bg-text">
      <span>{{ $route.name }}</span>
    </div>
  </div>

  <!-- The Buttons -->
  <div
    v-if="!hasBMI && !hasOutOfRangeBMI"
    class="buttons-container"
    ref="buttonsContainerRef"
  >
    <ConverterButtons
      mode="bmi"
      @appendNumber="appendNumber"
      @clear="clear"
      @backspace="backspace"
      @calculateBMI="calculateBMI"
    />
  </div>
  <div
    v-else-if="hasBMI && !hasOutOfRangeBMI"
    class="bg-navajo-white h-1/2 md:min-h-full relative -top-5 md:-top-0 rounded-xl rounded-s-none rounded-e-none"
  >
    <div class="px-8 py-4">
      <!-- BMI Results Wrapper -->
      <div
        class="flex justify-center items-center gap-3 pb-2 border-b-4 border-sandy-brown"
      >
        <h2 class="text-6xl">{{ userBMI }}</h2>
        <div class="flex flex-col items-center">
          <span class="text-3xl">BMI</span>
          <span class="text-sm">{{ bmiRange }}</span>
        </div>
      </div>

      <!-- Information Wrapper -->
      <div>
        <h3 class="mt-3 text-xl text-center">Information</h3>
        <div class="mt-5 flex text-center text-sm">
          <span class="w-5/6">Underweight</span>
          <span class="w-full">Normal</span>
          <span class="w-5/6">Overweight</span>
        </div>
        <div class="mt-3 flex">
          <!-- <span class="h-2 w-5/6 bg-blue-500"></span>
          <span class="h-2 w-full bg-green-500"></span>
          <span class="h-2 w-5/6 bg-red-500"></span> -->
          <span class="h-2 w-5/6 bg-mellow-apricot"></span>
          <span class="h-2 w-full bg-mango-tango"></span>
          <span class="h-2 w-5/6 bg-liver"></span>
        </div>
        <div class="mt-2 flex">
          <span class="w-5/6">16.0</span>
          <span class="w-full">18.5</span>
          <span class="w-5/6">25.0</span>
          <span class="">40.0</span>
        </div>
      </div>
      <button
        @click="closeBmiResults"
        class="w-full mt-4 p-2 bg-sandy-brown text-seal-brown rounded-md"
      >
        Close
      </button>
      <p class="mt-2 text-center text-xs">Powered by Calculate It!</p>
    </div>
  </div>
  <div
    v-else-if="!hasBMI && hasOutOfRangeBMI"
    class="bg-navajo-white h-1/2 md:min-h-full relative mt-auto rounded-xl rounded-s-none rounded-e-none"
  >
    <div class="px-8 py-4 text-center">
      <p>Oops! Something went wrong.</p>
      <p>Please check your units and retry.</p>
    </div>
    <button
      @click="closeBmiResults"
      class="w-full mt-4 p-2 bg-sandy-brown text-seal-brown rounded-md"
    >
      Close
    </button>
    <p class="mt-2 text-center text-xs">Powered by Calculate It!</p>
  </div>
</template>

<script setup>
import TheDropdown from "@/components/ui/TheDropdown.vue"
import ConverterButtons from "@/components/ui/ConverterButtons.vue"
import { ref, reactive, watch, inject, onMounted, onBeforeMount } from "vue"

const appendNumberToConverter = inject("appendNumber")
const removeCommas = inject("removeCommas")
const clearAll = inject("clearAll")
const clearChars = inject("clearChars")
const listenForKeyboardInputs = inject("listenForKeyboardInputs")
const showRippleEffectOnButtons = inject("showRippleEffectOnButtons")
const storeConverterDataLocally = inject("storeConverterDataLocally")
const getStoredConverterData = inject("getStoredConverterData")

// convert the template ref into a data ref
const buttonsContainerRef = ref(null)

const activeDropdown = ref("top")
const topUnitName = ref("Kilograms")
const bottomUnitName = ref("Centimeters")
const hasBMI = ref(false)
const hasOutOfRangeBMI = ref(false)
const userBMI = ref(null)
const bmiRange = ref(null)

// integer part of a float i.e 3.142 => 3
const integerPortion = reactive({
  topUnit: "",
  bottomUnit: ""
})

// non-reactive data
const weightUnits = ["Kilograms", "Pounds"]
const heightUnits = ["Centimeters", "Meters", "Feet", "Inches"]

// non reactive data object for units and their conversion rates
const conversionRates = {
  weight: {
    oneKilo: {
      poundEquiv: 2.20462262
    }
  },
  height: {
    oneCentimeter: {
      inchEquiv: 0.393700787
    },
    oneMeter: {
      inchEquiv: 39.3700787
    },
    oneFoot: {
      inchEquiv: 12
    }
  }
}

// reactive data object for related bmi data
const bmiData = reactive({
  name: "bmiData",
  topActiveUnit: "Kilograms",
  bottomActiveUnit: "Centimeters",
  topUnitValue: "",
  bottomUnitValue: "",
  defaultResult: 0
})

/*
 Watchers
*/
// when a user changes units, update the unit name below the result
watch(
  () => bmiData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "Pounds":
        topUnitName.value = "Pounds"
        break
      default:
        topUnitName.value = "Kilograms"
        break
    }

    storeConverterDataLocally(bmiData, integerPortion, activeDropdown)
  }
)

watch(
  () => bmiData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "Meters":
        bottomUnitName.value = "Meters"
        break
      case "Feet":
        bottomUnitName.value = "Feet"
        break
      case "Inches":
        bottomUnitName.value = "Inches"
        break
      default:
        bottomUnitName.value = "Centimeters"
        break
    }

    storeConverterDataLocally(bmiData, integerPortion, activeDropdown)
  }
)

// when the value of a unit changes, store the value locally
watch(
  () => bmiData.topUnitValue,
  (newValue) => {
    if (!newValue) appendNumber(0)
    storeConverterDataLocally(bmiData, integerPortion, activeDropdown)
  }
)

watch(
  () => bmiData.bottomUnitValue,
  (newValue) => {
    if (!newValue) appendNumber(0)
    storeConverterDataLocally(bmiData, integerPortion, activeDropdown)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => activeDropdown.value,
  (newValue) => {
    // reset the value that was previously entered for a unit
    integerPortion.topUnit = ""
    integerPortion.bottomUnit = ""

    storeConverterDataLocally(bmiData, integerPortion, activeDropdown)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(bmiData, integerPortion, activeDropdown)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(
    activeDropdown,
    bmiData,
    integerPortion,
    buttonsContainerRef
  )
  showRippleEffectOnButtons(buttonsContainerRef)

  // when the component is first mounted, set zero as the value of the active dropdown
  if (bmiData.topUnitValue === "" && bmiData.bottomUnitValue === "") {
    appendNumber(0)
  }
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, activeDropdown, bmiData, integerPortion)
}

const setActiveUnitTop = (unit) => {
  bmiData.topActiveUnit = unit
}

const setActiveUnitBottom = (unit) => {
  bmiData.bottomActiveUnit = unit
}

const clear = () => {
  if (!bmiData.topUnitValue && !bmiData.bottomUnitValue) return

  clearAll(bmiData, integerPortion, activeDropdown)
}

const backspace = () => {
  if (!bmiData.topUnitValue && !bmiData.bottomUnitValue) return

  clearChars(activeDropdown, bmiData, integerPortion)
}

const calculateBMI = () => {
  const minNormalRange = 18.5
  const maxNormalRange = 25.0
  const maxBMI = 50
  const minBMI = 0
  let weight // in pounds
  let height // in inches
  let bmi

  const activeWeightUnit = bmiData.topActiveUnit
  const activeHeightUnit = bmiData.bottomActiveUnit

  // convert the weight to pounds
  switch (activeWeightUnit) {
    case "Kilograms":
      weight = bmiData.topUnitValue * conversionRates.weight.oneKilo.poundEquiv
      break
    default:
      weight = bmiData.topUnitValue
      break
  }

  // convert the height to inches
  switch (activeHeightUnit) {
    case "Centimeters":
      height =
        bmiData.bottomUnitValue * conversionRates.height.oneCentimeter.inchEquiv
      break
    case "Meters":
      height =
        bmiData.bottomUnitValue * conversionRates.height.oneMeter.inchEquiv
      break
    case "Feet":
      height =
        bmiData.bottomUnitValue * conversionRates.height.oneFoot.inchEquiv
      break
    default:
      height = bmiData.bottomUnitValue
      break
  }

  weight = weight.toLocaleString("en", { maximumFractionDigits: 7 })
  height = height.toLocaleString("en", { maximumFractionDigits: 7 })

  // BMI formula: weight in pounds, height in inches
  bmi = weight * (703 / (height * height))
  if (isNaN(bmi)) bmi = 0

  if (bmi < minBMI || bmi > maxBMI) {
    hasBMI.value = false
    hasOutOfRangeBMI.value = true
    return
  }

  userBMI.value = bmi.toLocaleString("en", { maximumFractionDigits: 1 })
  hasBMI.value = true
  hasOutOfRangeBMI.value = false
  bmiRange.value =
    +userBMI.value < minNormalRange
      ? "Underweight"
      : +userBMI.value > maxNormalRange
      ? "Overweight"
      : "Normal"
}

const closeBmiResults = () => {
  hasBMI.value = false
  hasOutOfRangeBMI.value = false
}
</script>
