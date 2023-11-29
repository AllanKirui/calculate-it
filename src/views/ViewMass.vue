<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
    <TheDropdown
      :is-active="activeDropdown === 'top' ? true : false"
      :active-unit="massData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <div @click="activeDropdown = 'top'" class="relative w-full text-right">
      <h2 class="result" :class="[activeDropdown === 'top' ? 'active' : '']">
        {{ massData.topUnitValue || massData.defaultResult }}
      </h2>
      <span class="absolute right-0 text-xs md:text-sm">{{ topUnitName }}</span>
    </div>
  </div>

  <!-- Bottom Units -->
  <div class="dropdown-container bottom-dropdown">
    <TheDropdown
      :is-active="activeDropdown === 'bottom' ? true : false"
      :active-unit="massData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <div @click="activeDropdown = 'bottom'" class="relative w-full text-right">
      <h2 class="result" :class="[activeDropdown === 'bottom' ? 'active' : '']">
        {{ massData.bottomUnitValue || massData.defaultResult }}
      </h2>
      <span class="absolute right-0 text-xs md:text-sm">{{
        bottomUnitName
      }}</span>
    </div>
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
    class="buttons-container md:min-h-full grid grid-cols-4 grid-rows-4 gap-2 text-2xl mt-3"
    ref="buttonsContainerRef"
  >
    <ConverterButtons
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
const topUnitName = ref("Kilogram")
const bottomUnitName = ref("Pound")

// integer part of a float i.e 3.142 => 3
const integerPortion = reactive({
  topUnit: "",
  bottomUnit: ""
})

// reactive data object for related math data
const massData = reactive({
  name: "massData",
  topActiveUnit: "kg",
  bottomActiveUnit: "lb",
  hasSwitchedActiveDropdown: false,
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneKilo: {
    kilogramEquiv: 1,
    gramEquiv: 1000,
    poundEquiv: 2.20462262,
    ounceEquiv: 35.2739619
  },
  oneGram: {
    gramEquiv: 1,
    kilogramEquiv: 0.001,
    poundEquiv: 0.00220462262,
    ounceEquiv: 0.0352739619
  },
  onePound: {
    poundEquiv: 1,
    kilogramEquiv: 0.45359237,
    gramEquiv: 453.59237,
    ounceEquiv: 16
  },
  oneOunce: {
    ounceEquiv: 1,
    poundEquiv: 0.0625,
    kilogramEquiv: 0.0283495231,
    gramEquiv: 28.3495231
  }
}

// when a user changes units, update the unit name below the result
watch(
  () => massData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "g":
        topUnitName.value = "Gram"
        break
      case "lb":
        topUnitName.value = "Pound"
        break
      case "oz":
        topUnitName.value = "Ounce"
        break
      default:
        topUnitName.value = "Kilogram"
        break
    }

    if (!massData.topUnitValue && !massData.bottomUnitValue) return

    // if there was a previous unit value and the unit type changes
    // re-calculate the equivalent e.g. if top unit is 'kg' with a value of 5
    // and bottom unit is 'lb', and then top unit gets changed to 'g',
    // re-calculate the value of 5 grams to pounds
    if (activeDropdown.value === "top") {
      massData.bottomUnitValue = convertTopUnitToBottomEquiv(
        massData.topUnitValue
      )
    } else {
      massData.topUnitValue = convertBottomUnitToTopEquiv(
        massData.bottomUnitValue
      )
    }

    storeConverterDataLocally(massData, integerPortion, activeDropdown)
  }
)

watch(
  () => massData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "kg":
        bottomUnitName.value = "Kilogram"
        break
      case "g":
        bottomUnitName.value = "Gram"
        break
      case "oz":
        bottomUnitName.value = "Ounce"
        break
      default:
        bottomUnitName.value = "Pound"
        break
    }

    if (!massData.topUnitValue && !massData.bottomUnitValue) return

    if (activeDropdown.value === "bottom") {
      massData.topUnitValue = convertBottomUnitToTopEquiv(
        massData.bottomUnitValue
      )
    } else {
      massData.bottomUnitValue = convertTopUnitToBottomEquiv(
        massData.topUnitValue
      )
    }

    storeConverterDataLocally(massData, integerPortion, activeDropdown)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => massData.topUnitValue,
  (newValue) => {
    if (massData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    massData.bottomUnitValue = convertTopUnitToBottomEquiv(newValue)
    storeConverterDataLocally(massData, integerPortion, activeDropdown)
  }
)

watch(
  () => massData.bottomUnitValue,
  (newValue) => {
    if (massData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    massData.topUnitValue = convertBottomUnitToTopEquiv(newValue)
    storeConverterDataLocally(massData, integerPortion, activeDropdown)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => activeDropdown.value,
  (newValue) => {
    massData.hasSwitchedActiveDropdown = true // FIXME unused, remove also from TheCalc cmp
    /* 
    // FIXME
      The 2 lines below result in a bug when:
      topUnit is 'kg' and value is 5, bottomUnit is 'lb' and value has been calculated based on the topUnitValue
      switching topUnit to 'g' then switching active dropdown to 'bottom' and then trying to change the
      calculated 5000 gram value to any other unit
     */
    massData.hasConvertedToTopEquiv = false
    massData.hasConvertedToBottomEquiv = false

    // reset the value that was previously entered for a unit
    integerPortion.topUnit = ""
    integerPortion.bottomUnit = ""

    storeConverterDataLocally(massData, integerPortion, activeDropdown)
  }
)

// retrieve any locally stored converter data
onBeforeMount(() => {
  console.log("ViewMass retrieving data onBeforeMount")
  if (!localStorage) return
  getStoredConverterData(massData, integerPortion, activeDropdown)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(
    activeDropdown,
    massData,
    integerPortion,
    buttonsContainerRef
  )
  showRippleEffectOnButtons(buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, activeDropdown, massData, integerPortion)
}

const convertTopUnitToBottomEquiv = (unitValue) => {
  if (!unitValue) return

  // convert the string number to a number
  let topUnitValue = removeCommas(unitValue)

  let dropdown = "top"
  let convertedValue = convertValues(dropdown, topUnitValue)

  return !isNaN(parseFloat(convertedValue))
    ? convertedValue
    : massData.defaultResult
}

const convertBottomUnitToTopEquiv = (unitValue) => {
  if (!unitValue) return

  // convert the string number to a number
  let bottomUnitValue = removeCommas(unitValue)

  let dropdown = "bottom"
  let convertedValue = convertValues(dropdown, bottomUnitValue)

  return !isNaN(parseFloat(convertedValue))
    ? convertedValue
    : massData.defaultResult
}

const convertValues = (dropdown, unitValue) => {
  let activeUnitValue, activeUnit1, activeUnit2, convertedValue

  activeUnitValue = unitValue

  // check the active unit on the top and bottom dropdowns
  if (dropdown === "top") {
    activeUnit1 = massData.bottomActiveUnit
    activeUnit2 = massData.topActiveUnit
  } else {
    activeUnit1 = massData.topActiveUnit
    activeUnit2 = massData.bottomActiveUnit
  }

  // convert the top/bottom unit values based on the active
  // units on the adjacent dropdown
  switch (activeUnit1) {
    case "lb":
      switch (activeUnit2) {
        case "kg":
          convertedValue = conversionRates.oneKilo.poundEquiv * activeUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.poundEquiv * activeUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.poundEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.poundEquiv * activeUnitValue
          break
      }
      break
    case "g":
      switch (activeUnit2) {
        case "kg":
          convertedValue = conversionRates.oneKilo.gramEquiv * activeUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.gramEquiv * activeUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.gramEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.gramEquiv * activeUnitValue
          break
      }
      break
    case "oz":
      switch (activeUnit2) {
        case "kg":
          convertedValue = conversionRates.oneKilo.ounceEquiv * activeUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.ounceEquiv * activeUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.ounceEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.ounceEquiv * activeUnitValue
          break
      }
      break
    case "kg":
      switch (activeUnit2) {
        case "kg":
          convertedValue =
            conversionRates.oneKilo.kilogramEquiv * activeUnitValue
          break
        case "g":
          convertedValue =
            conversionRates.oneGram.kilogramEquiv * activeUnitValue
          break
        case "oz":
          convertedValue =
            conversionRates.oneOunce.kilogramEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.onePound.kilogramEquiv * activeUnitValue
          break
      }
      break
  }

  convertedValue = convertedValue.toLocaleString("en", {
    maximumFractionDigits: 7
  })

  return convertedValue
}

const setActiveUnitTop = (unit) => {
  massData.topActiveUnit = unit
  storeConverterDataLocally(massData, integerPortion, activeDropdown)
}

const setActiveUnitBottom = (unit) => {
  massData.bottomActiveUnit = unit
  storeConverterDataLocally(massData, integerPortion, activeDropdown)
}

const clear = () => {
  if (!massData.topUnitValue && !massData.bottomUnitValue) return

  clearAll(massData, integerPortion, activeDropdown)
}

const backspace = () => {
  if (!massData.topUnitValue && !massData.bottomUnitValue) return

  clearChars(activeDropdown, massData, integerPortion)
}
</script>
