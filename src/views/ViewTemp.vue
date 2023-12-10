<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :is-active="activeDropdown === 'top' ? true : false"
      :active-unit="temperatureData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <div @click="activeDropdown = 'top'" class="relative w-full text-right">
      <h2
        class="result"
        :class="[
          activeDropdown === 'top' ? 'active' : '',
          temperatureData.topUnitValue &&
          temperatureData.topUnitValue.length > 20
            ? 'text-2xl'
            : ''
        ]"
      >
        {{ temperatureData.topUnitValue || temperatureData.defaultResult }}
      </h2>
      <span class="absolute right-0 text-xs md:text-sm">{{ topUnitName }}</span>
    </div>
  </div>

  <!-- Bottom Units -->
  <div class="dropdown-container bottom-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :is-active="activeDropdown === 'bottom' ? true : false"
      :active-unit="temperatureData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <div @click="activeDropdown = 'bottom'" class="relative w-full text-right">
      <h2
        class="result"
        :class="[
          activeDropdown === 'bottom' ? 'active' : '',
          temperatureData.bottomUnitValue &&
          temperatureData.bottomUnitValue.length > 20
            ? 'text-2xl'
            : ''
        ]"
      >
        {{ temperatureData.bottomUnitValue || temperatureData.defaultResult }}
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
const convertTopUnitToBottomEquiv = inject("convertTopUnitToBottomEquiv")
const convertBottomUnitToTopEquiv = inject("convertBottomUnitToTopEquiv")

// convert the template ref into a data ref
const buttonsContainerRef = ref(null)

const activeDropdown = ref("top")
const topUnitName = ref("Celsius")
const bottomUnitName = ref("Fahrenheit")

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

// reactive data object for related math data
const temperatureData = reactive({
  name: "temperatureData",
  topActiveUnit: "°C",
  bottomActiveUnit: "°F",
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneCelsius: {
    celsiusEquiv: 1,
    fahrenheitEquiv: 33.8,
    kelvinEquiv: 274.15,
    rankineEquiv: 493.47,
    reaumurEquiv: 0.8
  },
  oneFahrenheit: {
    fahrenheitEquiv: 1,
    celsiusEquiv: -17.2222222,
    kelvinEquiv: 255.927778,
    rankineEquiv: 460.67,
    reaumurEquiv: -13.7777778
  },
  oneKelvin: {
    kelvinEquiv: 1,
    fahrenheitEquiv: -457.87,
    celsiusEquiv: -272.15,
    rankineEquiv: 1.8,
    reaumurEquiv: -217.72
  },
  oneRankine: {
    rankineEquiv: 1,
    kelvinEquiv: 0.555555556,
    fahrenheitEquiv: -458.67,
    celsiusEquiv: -272.594444,
    reaumurEquiv: -218.075556
  },
  oneReaumur: {
    reaumurEquiv: 1,
    rankineEquiv: 493.92,
    kelvinEquiv: 274.4,
    fahrenheitEquiv: 34.25,
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
        topUnitName.value = "Fahrenheit"
        break
      case "K":
        topUnitName.value = "Kelvin"
        break
      case "°R":
        topUnitName.value = "Rankine"
        break
      case "°Re":
        topUnitName.value = "Reaumur"
        break
      default:
        topUnitName.value = "Celsius"
        break
    }

    if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue)
      return

    if (activeDropdown.value === "top") {
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

    storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
  }
)

watch(
  () => temperatureData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "°C":
        bottomUnitName.value = "Celsius"
        break
      case "K":
        bottomUnitName.value = "Kelvin"
        break
      case "°R":
        bottomUnitName.value = "Rankine"
        break
      case "°Re":
        bottomUnitName.value = "Reaumur"
        break
      default:
        bottomUnitName.value = "Fahrenheit"
        break
    }

    if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue)
      return

    if (activeDropdown.value === "bottom") {
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

    storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => temperatureData.topUnitValue,
  (newValue) => {
    if (temperatureData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    temperatureData.bottomUnitValue = convertTopUnitToBottomEquiv(
      temperatureData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
  }
)

watch(
  () => temperatureData.bottomUnitValue,
  (newValue) => {
    if (temperatureData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    temperatureData.topUnitValue = convertBottomUnitToTopEquiv(
      temperatureData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => activeDropdown.value,
  (newValue) => {
    temperatureData.hasConvertedToTopEquiv = false
    temperatureData.hasConvertedToBottomEquiv = false

    // reset the value that was previously entered for a unit
    integerPortion.topUnit = ""
    integerPortion.bottomUnit = ""

    storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(temperatureData, integerPortion, activeDropdown)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(
    activeDropdown,
    temperatureData,
    integerPortion,
    buttonsContainerRef
  )
  showRippleEffectOnButtons(buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(
    number,
    activeDropdown,
    temperatureData,
    integerPortion
  )
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

  // convert the top/bottom unit values based on the active
  // units on the adjacent dropdown
  switch (activeUnit1) {
    case "°C":
      switch (activeUnit2) {
        case "°F":
          convertedValue =
            conversionRates.oneFahrenheit.celsiusEquiv * activeUnitValue
          break
        case "K":
          convertedValue =
            conversionRates.oneKelvin.celsiusEquiv * activeUnitValue
          break
        case "°R":
          convertedValue =
            conversionRates.oneRankine.celsiusEquiv * activeUnitValue
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
          convertedValue =
            conversionRates.oneKelvin.fahrenheitEquiv * activeUnitValue
          break
        case "°R":
          convertedValue =
            conversionRates.oneRankine.fahrenheitEquiv * activeUnitValue
          break
        case "°Re":
          convertedValue =
            conversionRates.oneReaumur.fahrenheitEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneCelsius.fahrenheitEquiv * activeUnitValue
          break
      }
      break
    case "K":
      switch (activeUnit2) {
        case "°F":
          convertedValue =
            conversionRates.oneFahrenheit.kelvinEquiv * activeUnitValue
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
          convertedValue =
            conversionRates.oneReaumur.kelvinEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneCelsius.kelvinEquiv * activeUnitValue
          break
      }
      break
    case "°R":
      switch (activeUnit2) {
        case "°F":
          convertedValue =
            conversionRates.oneFahrenheit.rankineEquiv * activeUnitValue
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
          convertedValue =
            conversionRates.oneReaumur.rankineEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneCelsius.rankineEquiv * activeUnitValue
          break
      }
      break
    case "°Re":
      switch (activeUnit2) {
        case "°F":
          convertedValue =
            conversionRates.oneFahrenheit.reaumurEquiv * activeUnitValue
          break
        case "K":
          convertedValue =
            conversionRates.oneKelvin.reaumurEquiv * activeUnitValue
          break
        case "°R":
          convertedValue =
            conversionRates.oneRankine.reaumurEquiv * activeUnitValue
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

const setActiveUnitTop = (unit) => {
  temperatureData.topActiveUnit = unit
  storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
}

const setActiveUnitBottom = (unit) => {
  temperatureData.bottomActiveUnit = unit
  storeConverterDataLocally(temperatureData, integerPortion, activeDropdown)
}

const clear = () => {
  if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue) return

  clearAll(temperatureData, integerPortion, activeDropdown)
}

const backspace = () => {
  if (!temperatureData.topUnitValue && !temperatureData.bottomUnitValue) return

  clearChars(activeDropdown, temperatureData, integerPortion)
}
</script>
