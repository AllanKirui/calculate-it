<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div @click="closeBmiResults" class="dropdown-container top-dropdown">
    <TheDropdown
      :calc-units="weightUnits"
      unit-type="Weight"
      :active-unit="bmiData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <UnitValue
      dropdown-owner="top"
      :converter-data="bmiData"
      @setActiveDropdown="setActiveDropdown"
    />
  </div>

  <!-- Bottom Units -->
  <div @click="closeBmiResults" class="dropdown-container bottom-dropdown">
    <TheDropdown
      :calc-units="heightUnits"
      unit-type="Height"
      :active-unit="bmiData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <UnitValue
      dropdown-owner="bottom"
      :converter-data="bmiData"
      @setActiveDropdown="setActiveDropdown"
    />
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
          <span class="h-2 w-5/6 bg-mellow-apricot"></span>
          <span class="h-2 w-full bg-mango-tango"></span>
          <span class="h-2 w-5/6 bg-liver"></span>
        </div>
        <div class="mt-2 flex">
          <span class="w-5/6">16.0</span>
          <span class="w-full">18.5</span>
          <span class="w-5/6">25.0</span>
          <span>40.0</span>
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
import UnitValue from "@/components/ui/UnitValue.vue"
import ConverterButtons from "@/components/ui/ConverterButtons.vue"
import {
  ref,
  reactive,
  watch,
  inject,
  nextTick,
  onMounted,
  onBeforeMount,
  onBeforeUnmount
} from "vue"

const appendNumberToConverter = inject("appendNumber")
const removeCommas = inject("removeCommas")
const clearAll = inject("clearAll")
const clearChars = inject("clearChars")
const listenForKeyboardInputs = inject("listenForKeyboardInputs")
const removeListenerForKeyboardInputs = inject(
  "removeListenerForKeyboardInputs"
)
const showRippleEffectOnButtons = inject("showRippleEffectOnButtons")
const storeConverterDataLocally = inject("storeConverterDataLocally")
const getStoredConverterData = inject("getStoredConverterData")

// convert the template ref into a data ref
const buttonsContainerRef = ref(null)

const hasBMI = ref(false)
const hasOutOfRangeBMI = ref(false)
const userBMI = ref(null)
const bmiRange = ref(null)

// number input for the top and bottom units
const numberInput = reactive({
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
  topUnitName: "Kilograms",
  bottomUnitName: "Centimeters",
  topUnitValue: "",
  bottomUnitValue: "",
  activeDropdown: "top",
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
        bmiData.topUnitName = "Pounds"
        break
      default:
        bmiData.topUnitName = "Kilograms"
        break
    }

    storeConverterDataLocally(bmiData, numberInput)
  }
)

watch(
  () => bmiData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "Meters":
        bmiData.bottomUnitName = "Meters"
        break
      case "Feet":
        bmiData.bottomUnitName = "Feet"
        break
      case "Inches":
        bmiData.bottomUnitName = "Inches"
        break
      default:
        bmiData.bottomUnitName = "Centimeters"
        break
    }

    storeConverterDataLocally(bmiData, numberInput)
  }
)

// when the value of a unit changes, store the value locally
watch(
  () => bmiData.topUnitValue,
  (newValue) => {
    if (!newValue) appendNumber(0)
    storeConverterDataLocally(bmiData, numberInput)
  }
)

watch(
  () => bmiData.bottomUnitValue,
  (newValue) => {
    if (!newValue) appendNumber(0)
    storeConverterDataLocally(bmiData, numberInput)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => bmiData.activeDropdown,
  (newValue) => {
    // reset the value that was previously entered for a unit
    numberInput.topUnit = ""
    numberInput.bottomUnit = ""

    storeConverterDataLocally(bmiData, numberInput)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(bmiData, numberInput)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(bmiData, numberInput, buttonsContainerRef)
  showRippleEffectOnButtons(buttonsContainerRef)

  // when the component is first mounted, set zero as the value of the active dropdown
  if (bmiData.topUnitValue === "" && bmiData.bottomUnitValue === "") {
    appendNumber(0)
  }
})

onBeforeUnmount(() => {
  removeListenerForKeyboardInputs(bmiData, numberInput, buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, bmiData, numberInput)
}

const setActiveDropdown = (dropdown) => {
  bmiData.activeDropdown = dropdown
}

const setActiveUnitTop = (unit) => {
  bmiData.topActiveUnit = unit
}

const setActiveUnitBottom = (unit) => {
  bmiData.bottomActiveUnit = unit
}

const clear = () => {
  if (!bmiData.topUnitValue && !bmiData.bottomUnitValue) return

  clearAll(bmiData, numberInput)
}

const backspace = () => {
  if (!bmiData.topUnitValue && !bmiData.bottomUnitValue) return

  clearChars(bmiData, numberInput)
}

const calculateBMI = () => {
  if (bmiData.topUnitValue === "" || bmiData.bottomUnitValue === "") {
    hasBMI.value = false
    hasOutOfRangeBMI.value = true
    return
  }

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

  nextTick(() => showRippleEffectOnButtons(buttonsContainerRef))
}
</script>
