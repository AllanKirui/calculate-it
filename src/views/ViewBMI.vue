<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
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
  <div class="dropdown-container bottom-dropdown">
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
  <div class="buttons-container" ref="buttonsContainerRef">
    <ConverterButtons
      mode="bmi"
      @appendNumber="appendNumber"
      @clear="clear"
      @backspace="backspace"
    />
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

// integer part of a float i.e 3.142 => 3
const integerPortion = reactive({
  topUnit: "",
  bottomUnit: ""
})

// non-reactive data
const weightUnits = ["Kilograms", "Pounds"]
const heightUnits = ["Centimeters", "Meters", "Feet", "Inches"]

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

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
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
</script>
