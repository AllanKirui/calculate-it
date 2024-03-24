<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :active-unit="temperatureData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <UnitValue
      dropdown-owner="top"
      :converter-data="temperatureData"
      @setActiveDropdown="setActiveDropdown"
    />
  </div>

  <!-- Bottom Units -->
  <div class="dropdown-container bottom-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :active-unit="temperatureData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <UnitValue
      dropdown-owner="bottom"
      :converter-data="temperatureData"
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
  <div class="buttons-container" ref="buttonsContainerRef">
    <ConverterButtons
      mode="temp"
      @appendNumber="appendNumber"
      @clear="clear"
      @backspace="backspace"
      @toggleNegativeValue="toggleNegativeValue"
    />
  </div>
</template>

<script setup>
import TheDropdown from "@/components/ui/TheDropdown.vue"
import UnitValue from "@/components/ui/UnitValue.vue"
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
const convertTopUnitToBottomEquiv = inject("convertTopUnitToBottomEquiv")
const convertBottomUnitToTopEquiv = inject("convertBottomUnitToTopEquiv")

// convert the template ref into a data ref
const buttonsContainerRef = ref(null)

// integer part of a float i.e 3.142 => 3
const integerPortion = reactive({
  topUnit: "",
  bottomUnit: ""
})

const calcUnits = ref({
  celsius: {
    shortName: "°C",
    longName: "Celsius °C"
  },
  fahrenheit: {
    shortName: "°F",
    longName: "Fahrenheit °F"
  },
  kelvin: {
    shortName: "K",
    longName: "Kelvin K"
  },
  rankine: {
    shortName: "°R",
    longName: "Rankine °R"
  },
  reaumur: {
    shortName: "°Re",
    longName: "Réaumur °Re"
  }
})

// reactive data object for related temperature data
const temperatureData = reactive({
  name: "temperatureData",
  topActiveUnit: "°C",
  bottomActiveUnit: "°F",
  topUnitName: "Celsius",
  bottomUnitName: "Fahrenheit",
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  activeDropdown: "top",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneCelsius: {
    celsiusEquiv: 1,
    reaumurEquiv: 0.8
  },
  oneFahrenheit: {
    fahrenheitEquiv: 1
  },
  oneKelvin: {
    kelvinEquiv: 1,
    rankineEquiv: 1.8
  },
  oneRankine: {
    rankineEquiv: 1,
    kelvinEquiv: 0.555555556
  },
  oneReaumur: {
    reaumurEquiv: 1,
    celsiusEquiv: 1.25
  }
}

/*
 Watchers
*/
// when a user changes units, update the unit name below the result
watch(
  () => temperatureData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "°F":
        temperatureData.topUnitName = "Fahrenheit"
        break
      case "K":
        temperatureData.topUnitName = "Kelvin"
        break
      case "°R":
        temperatureData.topUnitName = "Rankine"
        break
      case "°Re":
        temperatureData.topUnitName = "Reaumur"
        break
      default:
        temperatureData.topUnitName = "Celsius"
        break
    }

    if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue)
      return

    if (temperatureData.activeDropdown === "top") {
      temperatureData.bottomUnitValue = convertTopUnitToBottomEquiv(
        temperatureData,
        temperatureData.topUnitValue,
        convertValues
      )
      temperatureData.hasConvertedToTopEquiv = true
    } else {
      temperatureData.topUnitValue = convertBottomUnitToTopEquiv(
        temperatureData,
        temperatureData.bottomUnitValue,
        convertValues
      )
      temperatureData.hasConvertedToBottomEquiv = true
    }

    storeConverterDataLocally(temperatureData, integerPortion)
  }
)

watch(
  () => temperatureData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "°C":
        temperatureData.bottomUnitName = "Celsius"
        break
      case "K":
        temperatureData.bottomUnitName = "Kelvin"
        break
      case "°R":
        temperatureData.bottomUnitName = "Rankine"
        break
      case "°Re":
        temperatureData.bottomUnitName = "Reaumur"
        break
      default:
        temperatureData.bottomUnitName = "Fahrenheit"
        break
    }

    if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue)
      return

    if (temperatureData.activeDropdown === "bottom") {
      temperatureData.topUnitValue = convertBottomUnitToTopEquiv(
        temperatureData,
        temperatureData.bottomUnitValue,
        convertValues
      )
      temperatureData.hasConvertedToBottomEquiv = true
    } else {
      temperatureData.bottomUnitValue = convertTopUnitToBottomEquiv(
        temperatureData,
        temperatureData.topUnitValue,
        convertValues
      )
      temperatureData.hasConvertedToTopEquiv = true
    }

    storeConverterDataLocally(temperatureData, integerPortion)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => temperatureData.topUnitValue,
  (newValue) => {
    if (!newValue) appendNumber(0)
    if (temperatureData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    temperatureData.bottomUnitValue = convertTopUnitToBottomEquiv(
      temperatureData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(temperatureData, integerPortion)
  }
)

watch(
  () => temperatureData.bottomUnitValue,
  (newValue) => {
    if (!newValue) appendNumber(0)
    if (temperatureData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    temperatureData.topUnitValue = convertBottomUnitToTopEquiv(
      temperatureData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(temperatureData, integerPortion)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => temperatureData.activeDropdown,
  (newValue) => {
    temperatureData.hasConvertedToTopEquiv = false
    temperatureData.hasConvertedToBottomEquiv = false

    storeConverterDataLocally(temperatureData, integerPortion)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(temperatureData, integerPortion)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(temperatureData, integerPortion, buttonsContainerRef)
  showRippleEffectOnButtons(buttonsContainerRef)

  // when the component is first mounted, set zero as the value of the active dropdown
  if (
    temperatureData.topUnitValue === "" &&
    temperatureData.bottomUnitValue === ""
  ) {
    appendNumber(0)
  }
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, temperatureData, integerPortion)
}

const convertValues = (dropdown, unitValue) => {
  let activeUnitValue, activeUnit1, activeUnit2, convertedValue

  activeUnitValue = unitValue

  // check the active unit on the top and bottom dropdowns
  if (dropdown === "top") {
    activeUnit1 = temperatureData.bottomActiveUnit
    activeUnit2 = temperatureData.topActiveUnit
  } else {
    activeUnit1 = temperatureData.topActiveUnit
    activeUnit2 = temperatureData.bottomActiveUnit
  }

  /*
    Convert the top/bottom unit values based on the active units
    on the adjacent dropdown 

    Conversion Formulas
    ---------------------------------------------

    Celsius to Fahrenheit formula -> F = C * 1.8 + 32

    Celsius to Kelvin -> K = C + 273.15
    Kelvin to Celsius -> C = K - 273.15

    Celsius to Rankine -> R = (C * 1.8) + 491.67
    Rankine to Celsius -> C = (R - 491.67) / 1.79999999

    Fahrenheit to Kelvin -> K = ((F - 32) / 1.799999999) + 273.15
    Kelvin to Fahrenheit -> F = ((K - 273.15) * 1.8) + 32

    Rankine to Fahrenheit -> F = R - 459.67
    Fahrenheit to Rankine -> R = F + 459.67

    Reaumur to Fahrenheit -> F = (Re * 2.25) + 32
    Fahrenheit to Reaumur -> Re = (F - 32) / 2.25000002

    Kelvin to Reaumur -> Re = (K - 273.15) / 1.25
    Reaumur to Kelvin -> K = (Re * 1.25) + 273.15

    Rankine to Reaumur -> Re = (R - 491.67) / 2.25000002
    Reaumur to Rankine -> R = (Re * 2.25) + 491.67
  */
  switch (activeUnit1) {
    case "°C":
      switch (activeUnit2) {
        case "°F":
          convertedValue = (activeUnitValue - 32) / 1.8 // Fahrenheit to Celsius
          break
        case "K":
          convertedValue = activeUnitValue - 273.15 // Kelvin to Celsius
          break
        case "°R":
          convertedValue = (activeUnitValue - 491.67) / 1.79999999 // Rankine to Celsius
          break
        case "°Re":
          convertedValue =
            conversionRates.oneReaumur.celsiusEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneCelsius.celsiusEquiv * activeUnitValue
          break
      }
      break
    case "°F":
      switch (activeUnit2) {
        case "°F":
          convertedValue =
            conversionRates.oneFahrenheit.fahrenheitEquiv * activeUnitValue
          break
        case "K":
          convertedValue = (activeUnitValue - 273.15) * 1.8 + 32 // Kelvin to Fahrenheit
          break
        case "°R":
          convertedValue = activeUnitValue - 459.67 // Rankine to Fahrenheit
          break
        case "°Re":
          convertedValue = activeUnitValue * 2.25 + 32 // Reaumur to Fahrenheit
          break
        default:
          convertedValue = activeUnitValue * 1.8 + 32 // Celsius to Fahrenheit
          break
      }
      break
    case "K":
      switch (activeUnit2) {
        case "°F":
          convertedValue = (activeUnitValue - 32) / 1.79999999 + 273.15 // Fahrenheit to Kelvin
          break
        case "K":
          convertedValue =
            conversionRates.oneKelvin.kelvinEquiv * activeUnitValue
          break
        case "°R":
          convertedValue =
            conversionRates.oneRankine.kelvinEquiv * activeUnitValue
          break
        case "°Re":
          convertedValue = activeUnitValue * 1.25 + 273.15 // Reaumur to Kelvin
          break
        default:
          convertedValue = activeUnitValue + 273.15 // Celsius to Kelvin
          break
      }
      break
    case "°R":
      switch (activeUnit2) {
        case "°F":
          convertedValue = activeUnitValue + 459.67 // Fahrenheit to Rankine
          break
        case "K":
          convertedValue =
            conversionRates.oneKelvin.rankineEquiv * activeUnitValue
          break
        case "°R":
          convertedValue =
            conversionRates.oneRankine.rankineEquiv * activeUnitValue
          break
        case "°Re":
          convertedValue = activeUnitValue * 2.25 + 491.67 // Reaumur to Rankine
          break
        default:
          convertedValue = activeUnitValue * 1.8 + 491.67 // Celsius to Rankine
          break
      }
      break
    case "°Re":
      switch (activeUnit2) {
        case "°F":
          convertedValue = (activeUnitValue - 32) / 2.25000002 // Fahrenheit to Reaumur
          break
        case "K":
          convertedValue = (activeUnitValue - 273.15) / 1.25 // Kelvin to Reaumur
          break
        case "°R":
          convertedValue = (activeUnitValue - 491.67) / 2.25000002 // Rankine to Reaumur
          break
        case "°Re":
          convertedValue =
            conversionRates.oneReaumur.reaumurEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneCelsius.reaumurEquiv * activeUnitValue
          break
      }
      break
  }

  convertedValue = convertedValue.toLocaleString("en", {
    maximumFractionDigits: 7
  })

  return convertedValue
}

const setActiveDropdown = (dropdown) => {
  temperatureData.activeDropdown = dropdown
}

const setActiveUnitTop = (unit) => {
  temperatureData.topActiveUnit = unit
  storeConverterDataLocally(temperatureData, integerPortion)
}

const setActiveUnitBottom = (unit) => {
  temperatureData.bottomActiveUnit = unit
  storeConverterDataLocally(temperatureData, integerPortion)
}

const clear = () => {
  if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue) return

  clearAll(temperatureData, integerPortion)
}

const backspace = () => {
  if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue) return

  clearChars(temperatureData, integerPortion)
}

const toggleNegativeValue = () => {
  if (temperatureData.activeDropdown === "top") {
    temperatureData.topUnitValue = `${-temperatureData.topUnitValue}`
    integerPortion.topUnit = temperatureData.topUnitValue

    // the hasConvertedTo... flag prevents the watcher methods for topUnitValue
    // and bottomUnitValue from running twice inside child components
    temperatureData.hasConvertedToTopEquiv = true
  } else {
    temperatureData.bottomUnitValue = `${-temperatureData.bottomUnitValue}`
    integerPortion.bottomUnit = temperatureData.bottomUnitValue
    temperatureData.hasConvertedToBottomEquiv = true
  }
}
</script>
