<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :active-unit="lengthData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <UnitValue
      dropdown-owner="top"
      :converter-data="lengthData"
      @setActiveDropdown="setActiveDropdown"
    />
  </div>

  <!-- Bottom Units -->
  <div class="dropdown-container bottom-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :active-unit="lengthData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <UnitValue
      dropdown-owner="bottom"
      :converter-data="lengthData"
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
      @appendNumber="appendNumber"
      @clear="clear"
      @backspace="backspace"
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
  foot: {
    shortName: "ft",
    longName: "Foot ft"
  },
  meter: {
    shortName: "m",
    longName: "Meter m"
  },
  kilometer: {
    shortName: "km",
    longName: "Kilometer km"
  },
  mile: {
    shortName: "mi",
    longName: "Mile mi"
  },
  centimeter: {
    shortName: "cm",
    longName: "Centimeter cm"
  },
  millimeter: {
    shortName: "mm",
    longName: "Millimeter mm"
  },
  yard: {
    shortName: "yd",
    longName: "Yard yd"
  },
  inch: {
    shortName: "in",
    longName: "Inch in"
  }
})

// reactive data object for related length data
const lengthData = reactive({
  name: "lengthData",
  topActiveUnit: "ft",
  bottomActiveUnit: "m",
  topUnitName: "Foot",
  bottomUnitName: "Meter",
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  activeDropdown: "top",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneFoot: {
    footEquiv: 1,
    meterEquiv: 0.3048,
    kilometerEquiv: 0.0003048,
    mileEquiv: 0.000189393939,
    centimeterEquiv: 30.48,
    millimeterEquiv: 304.8,
    yardEquiv: 0.333333333,
    inchEquiv: 12
  },
  oneMeter: {
    meterEquiv: 1,
    footEquiv: 3.2808399,
    kilometerEquiv: 0.001,
    mileEquiv: 0.000621371192,
    centimeterEquiv: 100,
    millimeterEquiv: 1000,
    yardEquiv: 1.0936133,
    inchEquiv: 39.3700787
  },
  oneKilometer: {
    kilometerEquiv: 1,
    meterEquiv: 1000,
    footEquiv: 3280.8399,
    mileEquiv: 0.621371192,
    centimeterEquiv: 100000,
    millimeterEquiv: 1000000,
    yardEquiv: 1093.6133,
    inchEquiv: 39370.0787
  },
  oneMile: {
    mileEquiv: 1,
    kilometerEquiv: 1.609344,
    meterEquiv: 1609.344,
    footEquiv: 5280,
    centimeterEquiv: 160934.4,
    millimeterEquiv: 1609344,
    yardEquiv: 1760,
    inchEquiv: 63360
  },
  oneCentimeter: {
    centimeterEquiv: 1,
    mileEquiv: 0.00000621371192,
    kilometerEquiv: 0.00001,
    meterEquiv: 0.01,
    footEquiv: 0.032808399,
    millimeterEquiv: 10,
    yardEquiv: 0.010936133,
    inchEquiv: 0.393700787
  },
  oneMillimeter: {
    millimeterEquiv: 1,
    centimeterEquiv: 0.1,
    mileEquiv: 0.000000621371192,
    kilometerEquiv: 0.000001,
    meterEquiv: 0.001,
    footEquiv: 0.0032808399,
    yardEquiv: 0.0010936133,
    inchEquiv: 0.0393700787
  },
  oneYard: {
    yardEquiv: 1,
    millimeterEquiv: 914.4,
    centimeterEquiv: 91.44,
    mileEquiv: 0.000568181818,
    kilometerEquiv: 0.0009144,
    meterEquiv: 0.9144,
    footEquiv: 3,
    inchEquiv: 36
  },
  oneInch: {
    inchEquiv: 1,
    millimeterEquiv: 25.4,
    centimeterEquiv: 2.54,
    mileEquiv: 0.0000157828283,
    kilometerEquiv: 0.0000254,
    meterEquiv: 0.0254,
    footEquiv: 0.0833333333,
    yardEquiv: 0.0277777778
  }
}

/*
 Watchers
*/
// when a user changes units, update the unit name below the result
watch(
  () => lengthData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "m":
        lengthData.topUnitName = "Meter"
        break
      case "km":
        lengthData.topUnitName = "Kilometer"
        break
      case "mi":
        lengthData.topUnitName = "Mile"
        break
      case "cm":
        lengthData.topUnitName = "Centimeter"
        break
      case "mm":
        lengthData.topUnitName = "Millimeter"
        break
      case "yd":
        lengthData.topUnitName = "Yard"
        break
      case "in":
        lengthData.topUnitName = "Inch"
        break
      default:
        lengthData.topUnitName = "Foot"
        break
    }

    if (!lengthData.topUnitValue && !lengthData.bottomUnitValue) return

    // if there was a previous unit value and the unit type changes
    // re-calculate the equivalent e.g. if top unit is 'kg' with a value of 5
    // and bottom unit is 'lb', and then top unit gets changed to 'g',
    // re-calculate the value of 5 grams to pounds
    if (lengthData.activeDropdown === "top") {
      lengthData.bottomUnitValue = convertTopUnitToBottomEquiv(
        lengthData,
        lengthData.topUnitValue,
        convertValues
      )
      lengthData.hasConvertedToTopEquiv = true
    } else {
      lengthData.topUnitValue = convertBottomUnitToTopEquiv(
        lengthData,
        lengthData.bottomUnitValue,
        convertValues
      )
      lengthData.hasConvertedToBottomEquiv = true
    }

    storeConverterDataLocally(lengthData, integerPortion)
  }
)

watch(
  () => lengthData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "ft":
        lengthData.bottomUnitName = "Foot"
        break
      case "km":
        lengthData.bottomUnitName = "Kilometer"
        break
      case "mi":
        lengthData.bottomUnitName = "Mile"
        break
      case "cm":
        lengthData.bottomUnitName = "Centimeter"
        break
      case "mm":
        lengthData.bottomUnitName = "Millimeter"
        break
      case "yd":
        lengthData.bottomUnitName = "Yard"
        break
      case "in":
        lengthData.bottomUnitName = "Inch"
        break
      default:
        lengthData.bottomUnitName = "Meter"
        break
    }

    if (!lengthData.topUnitValue && !lengthData.bottomUnitValue) return

    if (lengthData.activeDropdown === "bottom") {
      lengthData.topUnitValue = convertBottomUnitToTopEquiv(
        lengthData,
        lengthData.bottomUnitValue,
        convertValues
      )
      lengthData.hasConvertedToBottomEquiv = true
    } else {
      lengthData.bottomUnitValue = convertTopUnitToBottomEquiv(
        lengthData,
        lengthData.topUnitValue,
        convertValues
      )
      lengthData.hasConvertedToTopEquiv = true
    }

    storeConverterDataLocally(lengthData, integerPortion)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => lengthData.topUnitValue,
  (newValue) => {
    if (lengthData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    lengthData.bottomUnitValue = convertTopUnitToBottomEquiv(
      lengthData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(lengthData, integerPortion)
  }
)

watch(
  () => lengthData.bottomUnitValue,
  (newValue) => {
    if (lengthData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    lengthData.topUnitValue = convertBottomUnitToTopEquiv(
      lengthData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(lengthData, integerPortion)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => lengthData.activeDropdown,
  (newValue) => {
    lengthData.hasConvertedToTopEquiv = false
    lengthData.hasConvertedToBottomEquiv = false

    // reset the value that was previously entered for a unit
    integerPortion.topUnit = ""
    integerPortion.bottomUnit = ""

    storeConverterDataLocally(lengthData, integerPortion)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(lengthData, integerPortion)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(lengthData, integerPortion, buttonsContainerRef)
  showRippleEffectOnButtons(buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, lengthData, integerPortion)
}

const convertValues = (dropdown, unitValue) => {
  let activeUnitValue, activeUnit1, activeUnit2, convertedValue

  activeUnitValue = unitValue

  // check the active unit on the top and bottom dropdowns
  if (dropdown === "top") {
    activeUnit1 = lengthData.bottomActiveUnit
    activeUnit2 = lengthData.topActiveUnit
  } else {
    activeUnit1 = lengthData.topActiveUnit
    activeUnit2 = lengthData.bottomActiveUnit
  }

  // convert the top/bottom unit values based on the active
  // units on the adjacent dropdown
  switch (activeUnit1) {
    case "m":
      switch (activeUnit2) {
        case "ft":
          convertedValue = conversionRates.oneFoot.meterEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.meterEquiv * activeUnitValue
          break
        case "mi":
          convertedValue = conversionRates.oneMile.meterEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.meterEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.meterEquiv * activeUnitValue
          break
        case "yd":
          convertedValue = conversionRates.oneYard.meterEquiv * activeUnitValue
          break
        case "in":
          convertedValue = conversionRates.oneInch.meterEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneMeter.meterEquiv * activeUnitValue
          break
      }
      break
    case "ft":
      switch (activeUnit2) {
        case "ft":
          convertedValue = conversionRates.oneFoot.footEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.footEquiv * activeUnitValue
          break
        case "mi":
          convertedValue = conversionRates.oneMile.footEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.footEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.footEquiv * activeUnitValue
          break
        case "yd":
          convertedValue = conversionRates.oneYard.footEquiv * activeUnitValue
          break
        case "in":
          convertedValue = conversionRates.oneInch.footEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneMeter.footEquiv * activeUnitValue
          break
      }
      break
    case "km":
      switch (activeUnit2) {
        case "ft":
          convertedValue =
            conversionRates.oneFoot.kilometerEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.kilometerEquiv * activeUnitValue
          break
        case "mi":
          convertedValue =
            conversionRates.oneMile.kilometerEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.kilometerEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.kilometerEquiv * activeUnitValue
          break
        case "yd":
          convertedValue =
            conversionRates.oneYard.kilometerEquiv * activeUnitValue
          break
        case "in":
          convertedValue =
            conversionRates.oneInch.kilometerEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneMeter.kilometerEquiv * activeUnitValue
          break
      }
      break
    case "mi":
      switch (activeUnit2) {
        case "ft":
          convertedValue = conversionRates.oneFoot.mileEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.mileEquiv * activeUnitValue
          break
        case "mi":
          convertedValue = conversionRates.oneMile.mileEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.mileEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.mileEquiv * activeUnitValue
          break
        case "yd":
          convertedValue = conversionRates.oneYard.mileEquiv * activeUnitValue
          break
        case "in":
          convertedValue = conversionRates.oneInch.mileEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneMeter.mileEquiv * activeUnitValue
          break
      }
      break
    case "cm":
      switch (activeUnit2) {
        case "ft":
          convertedValue =
            conversionRates.oneFoot.centimeterEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.centimeterEquiv * activeUnitValue
          break
        case "mi":
          convertedValue =
            conversionRates.oneMile.centimeterEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.centimeterEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.centimeterEquiv * activeUnitValue
          break
        case "yd":
          convertedValue =
            conversionRates.oneYard.centimeterEquiv * activeUnitValue
          break
        case "in":
          convertedValue =
            conversionRates.oneInch.centimeterEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneMeter.centimeterEquiv * activeUnitValue
          break
      }
      break
    case "mm":
      switch (activeUnit2) {
        case "ft":
          convertedValue =
            conversionRates.oneFoot.millimeterEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.millimeterEquiv * activeUnitValue
          break
        case "mi":
          convertedValue =
            conversionRates.oneMile.millimeterEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.millimeterEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.millimeterEquiv * activeUnitValue
          break
        case "yd":
          convertedValue =
            conversionRates.oneYard.millimeterEquiv * activeUnitValue
          break
        case "in":
          convertedValue =
            conversionRates.oneInch.millimeterEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneMeter.millimeterEquiv * activeUnitValue
          break
      }
      break
    case "yd":
      switch (activeUnit2) {
        case "ft":
          convertedValue = conversionRates.oneFoot.yardEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.yardEquiv * activeUnitValue
          break
        case "mi":
          convertedValue = conversionRates.oneMile.yardEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.yardEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.yardEquiv * activeUnitValue
          break
        case "yd":
          convertedValue = conversionRates.oneYard.yardEquiv * activeUnitValue
          break
        case "in":
          convertedValue = conversionRates.oneInch.yardEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneMeter.yardEquiv * activeUnitValue
          break
      }
      break
    case "in":
      switch (activeUnit2) {
        case "ft":
          convertedValue = conversionRates.oneFoot.inchEquiv * activeUnitValue
          break
        case "km":
          convertedValue =
            conversionRates.oneKilometer.inchEquiv * activeUnitValue
          break
        case "mi":
          convertedValue = conversionRates.oneMile.inchEquiv * activeUnitValue
          break
        case "cm":
          convertedValue =
            conversionRates.oneCentimeter.inchEquiv * activeUnitValue
          break
        case "mm":
          convertedValue =
            conversionRates.oneMillimeter.inchEquiv * activeUnitValue
          break
        case "yd":
          convertedValue = conversionRates.oneYard.inchEquiv * activeUnitValue
          break
        case "in":
          convertedValue = conversionRates.oneInch.inchEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneMeter.inchEquiv * activeUnitValue
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
  lengthData.activeDropdown = dropdown
}

const setActiveUnitTop = (unit) => {
  lengthData.topActiveUnit = unit
  storeConverterDataLocally(lengthData, integerPortion)
}

const setActiveUnitBottom = (unit) => {
  lengthData.bottomActiveUnit = unit
  storeConverterDataLocally(lengthData, integerPortion)
}

const clear = () => {
  if (!lengthData.topUnitValue && !lengthData.bottomUnitValue) return

  clearAll(lengthData, integerPortion)
}

const backspace = () => {
  if (!lengthData.topUnitValue && !lengthData.bottomUnitValue) return

  clearChars(lengthData, integerPortion)
}
</script>
