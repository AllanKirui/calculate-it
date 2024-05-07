<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :active-unit="speedData.topActiveUnit"
      @setActiveUnit="setActiveUnitTop"
    />
    <UnitValue
      dropdown-owner="top"
      :converter-data="speedData"
      @setActiveDropdown="setActiveDropdown"
    />
  </div>

  <!-- Bottom Units -->
  <div class="dropdown-container bottom-dropdown">
    <TheDropdown
      :calc-units="calcUnits"
      :active-unit="speedData.bottomActiveUnit"
      @setActiveUnit="setActiveUnitBottom"
    />
    <UnitValue
      dropdown-owner="bottom"
      :converter-data="speedData"
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
import {
  ref,
  reactive,
  watch,
  inject,
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
const convertTopUnitToBottomEquiv = inject("convertTopUnitToBottomEquiv")
const convertBottomUnitToTopEquiv = inject("convertBottomUnitToTopEquiv")

// convert the template ref into a data ref
const buttonsContainerRef = ref(null)

// number input for the top and bottom units
const numberInput = reactive({
  topUnit: "",
  bottomUnit: ""
})

const calcUnits = ref({
  lightspeed: {
    shortName: "c",
    longName: "Lightspeed y"
  },
  mach: {
    shortName: "Ma",
    longName: "Mach Ma"
  },
  meter: {
    shortName: "m/s",
    longName: "Meter per second m/s"
  },
  kilometerPerHour: {
    shortName: "km/h",
    longName: "Kilometer per hour km/h"
  },
  kilometerPerSecond: {
    shortName: "km/s",
    longName: "Kilometer per second km/s"
  },
  knot: {
    shortName: "kn",
    longName: "Knot kn"
  },
  mile: {
    shortName: "mph",
    longName: "Mile per hour mph"
  },
  foot: {
    shortName: "fps",
    longName: "Foot per second fps"
  },
  inch: {
    shortName: "ips",
    longName: "Inch per second ips"
  }
})

// reactive data object for related speed data
const speedData = reactive({
  name: "speedData",
  topActiveUnit: "km/h",
  bottomActiveUnit: "mph",
  topUnitName: "Kilometer per hour",
  bottomUnitName: "Mile per hour",
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  activeDropdown: "top",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneLightspeed: {
    lightspeedEquiv: 1,
    machEquiv: 880965.201,
    msEquiv: 299792458,
    kmhEquiv: 1079252850,
    kmsEquiv: 299792.458,
    knotEquiv: 582749918,
    mphEquiv: 670616629,
    fpsEquiv: 983571056,
    ipsEquiv: 11802852700
  },
  oneMach: {
    machEquiv: 1,
    lightspeedEquiv: 0.00000113511862,
    msEquiv: 340.3,
    kmhEquiv: 1225.08,
    kmsEquiv: 0.3403,
    knotEquiv: 661.490281,
    mphEquiv: 761.22942,
    fpsEquiv: 1116.46982,
    ipsEquiv: 13397.6378
  },
  oneMeterPerSec: {
    msEquiv: 1,
    machEquiv: 0.0029385836,
    lightspeedEquiv: 0.00000000333564095,
    kmhEquiv: 3.6,
    kmsEquiv: 0.001,
    knotEquiv: 1.94384449,
    mphEquiv: 2.23693629,
    fpsEquiv: 3.2808399,
    ipsEquiv: 39.3700787
  },
  oneKilometerPerHour: {
    kmhEquiv: 1,
    msEquiv: 0.277777778,
    machEquiv: 0.000816273223,
    lightspeedEquiv: 0.000000000926566931,
    kmsEquiv: 0.000277777778,
    knotEquiv: 0.539956803,
    mphEquiv: 0.621371192,
    fpsEquiv: 0.911344415,
    ipsEquiv: 10.936133
  },
  oneKilometerPerSec: {
    kmsEquiv: 1,
    kmhEquiv: 3600,
    msEquiv: 1000,
    machEquiv: 2.9385836,
    lightspeedEquiv: 0.00000333564095,
    knotEquiv: 1943.84449,
    mphEquiv: 2236.93629,
    fpsEquiv: 3280.8399,
    ipsEquiv: 39370.0787
  },
  oneKnot: {
    knotEquiv: 1,
    kmsEquiv: 0.000514444444,
    kmhEquiv: 1.852,
    msEquiv: 0.514444444,
    machEquiv: 0.00151173801,
    lightspeedEquiv: 0.00000000171600196,
    mphEquiv: 1.15077945,
    fpsEquiv: 1.68780986,
    ipsEquiv: 20.2537183
  },
  oneMilePerHour: {
    mphEquiv: 1,
    knotEquiv: 0.868976242,
    kmsEquiv: 0.00044704,
    kmhEquiv: 1.609344,
    msEquiv: 0.44704,
    machEquiv: 0.00131366441,
    lightspeedEquiv: 0.00000000149116493,
    fpsEquiv: 1.46666667,
    ipsEquiv: 17.6
  },
  oneFootPerSec: {
    fpsEquiv: 1,
    mphEquiv: 0.681818182,
    knotEquiv: 0.592483801,
    kmsEquiv: 0.0003048,
    kmhEquiv: 1.09728,
    msEquiv: 0.3048,
    machEquiv: 0.000895680282,
    lightspeedEquiv: 0.00000000101670336,
    ipsEquiv: 12
  },
  oneInchPerSec: {
    ipsEquiv: 1,
    fpsEquiv: 0.0833333333,
    mphEquiv: 0.0568181818,
    knotEquiv: 0.0493736501,
    kmsEquiv: 0.0000254,
    kmhEquiv: 0.09144,
    msEquiv: 0.0254,
    machEquiv: 0.0000746400235,
    lightspeedEquiv: 0.0000000000847252802
  }
}

/*
 Watchers
*/
// when a user changes units, update the unit name below the result
watch(
  () => speedData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "c":
        speedData.topUnitName = "Lightspeed"
        break
      case "Ma":
        speedData.topUnitName = "Mach"
        break
      case "m/s":
        speedData.topUnitName = "Meter per second"
        break
      case "km/s":
        speedData.topUnitName = "Kilometer per second"
        break
      case "kn":
        speedData.topUnitName = "Knot"
        break
      case "mph":
        speedData.topUnitName = "Mile per hour"
        break
      case "fps":
        speedData.topUnitName = "Foot per second"
        break
      case "ips":
        speedData.topUnitName = "Inch per second"
        break
      default:
        speedData.topUnitName = "Kilometer per hour"
        break
    }

    if (!speedData.topUnitValue && !speedData.bottomUnitValue) return

    // if there was a previous unit value and the unit type changes
    // re-calculate the equivalent e.g. if top unit is 'kg' with a value of 5
    // and bottom unit is 'lb', and then top unit gets changed to 'g',
    // re-calculate the value of 5 grams to pounds
    if (speedData.activeDropdown === "top") {
      speedData.bottomUnitValue = convertTopUnitToBottomEquiv(
        speedData,
        speedData.topUnitValue,
        convertValues
      )
      speedData.hasConvertedToTopEquiv = true
    } else {
      speedData.topUnitValue = convertBottomUnitToTopEquiv(
        speedData,
        speedData.bottomUnitValue,
        convertValues
      )
      speedData.hasConvertedToBottomEquiv = true
    }

    storeConverterDataLocally(speedData, numberInput)
  }
)

watch(
  () => speedData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "c":
        speedData.bottomUnitName = "Lightspeed"
        break
      case "Ma":
        speedData.bottomUnitName = "Mach"
        break
      case "m/s":
        speedData.bottomUnitName = "Meter per second"
        break
      case "km/h":
        speedData.bottomUnitName = "Kilometer per hour"
        break
      case "km/s":
        speedData.bottomUnitName = "Kilometer per second"
        break
      case "kn":
        speedData.bottomUnitName = "Knot"
        break
      case "fps":
        speedData.bottomUnitName = "Foot per second"
        break
      case "ips":
        speedData.bottomUnitName = "Inch per second"
        break
      default:
        speedData.bottomUnitName = "Mile per hour"
        break
    }

    if (!speedData.topUnitValue && !speedData.bottomUnitValue) return

    if (speedData.activeDropdown === "bottom") {
      speedData.topUnitValue = convertBottomUnitToTopEquiv(
        speedData,
        speedData.bottomUnitValue,
        convertValues
      )
      speedData.hasConvertedToBottomEquiv = true
    } else {
      speedData.bottomUnitValue = convertTopUnitToBottomEquiv(
        speedData,
        speedData.topUnitValue,
        convertValues
      )
      speedData.hasConvertedToTopEquiv = true
    }

    storeConverterDataLocally(speedData, numberInput)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => speedData.topUnitValue,
  (newValue) => {
    if (speedData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    speedData.bottomUnitValue = convertTopUnitToBottomEquiv(
      speedData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(speedData, numberInput)
  }
)

watch(
  () => speedData.bottomUnitValue,
  (newValue) => {
    if (speedData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    speedData.topUnitValue = convertBottomUnitToTopEquiv(
      speedData,
      newValue,
      convertValues
    )
    storeConverterDataLocally(speedData, numberInput)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => speedData.activeDropdown,
  (newValue) => {
    speedData.hasConvertedToTopEquiv = false
    speedData.hasConvertedToBottomEquiv = false

    // reset the value that was previously entered for a unit
    numberInput.topUnit = ""
    numberInput.bottomUnit = ""

    storeConverterDataLocally(speedData, numberInput)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(speedData, numberInput)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(speedData, numberInput, buttonsContainerRef)
  showRippleEffectOnButtons(buttonsContainerRef)

  // when the component is mounted, set 1 as the value of the active dropdown
  if (speedData.topUnitValue === "" && speedData.bottomUnitValue === "") {
    appendNumber(1)
  }
})

onBeforeUnmount(() => {
  removeListenerForKeyboardInputs(speedData, numberInput, buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, speedData, numberInput)
}

const convertValues = (dropdown, unitValue) => {
  let activeUnitValue, activeUnit1, activeUnit2, convertedValue

  activeUnitValue = unitValue

  // check the active unit on the top and bottom dropdowns
  if (dropdown === "top") {
    activeUnit1 = speedData.bottomActiveUnit
    activeUnit2 = speedData.topActiveUnit
  } else {
    activeUnit1 = speedData.topActiveUnit
    activeUnit2 = speedData.bottomActiveUnit
  }

  // convert the top/bottom unit values based on the active
  // units on the adjacent dropdown
  switch (activeUnit1) {
    case "km/h":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.kmhEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.kmhEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.kmhEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.kmhEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.kmhEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.kmhEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.kmhEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.kmhEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.kmhEquiv * activeUnitValue
          break
      }
      break
    case "mph":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.mphEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.mphEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.mphEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.mphEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.mphEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.mphEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.mphEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.mphEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.mphEquiv * activeUnitValue
          break
      }
      break
    case "m/s":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.msEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.msEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.msEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.msEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.msEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.msEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.msEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.msEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.msEquiv * activeUnitValue
          break
      }
      break
    case "c":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.lightspeedEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue =
            conversionRates.oneMach.lightspeedEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.lightspeedEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.lightspeedEquiv * activeUnitValue
          break
        case "kn":
          convertedValue =
            conversionRates.oneKnot.lightspeedEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.lightspeedEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.lightspeedEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.lightspeedEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.lightspeedEquiv *
            activeUnitValue
          break
      }
      break
    case "Ma":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.machEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.machEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.machEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.machEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.machEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.machEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.machEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.machEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.machEquiv * activeUnitValue
          break
      }
      break
    case "km/s":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.kmsEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.kmsEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.kmsEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.kmsEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.kmsEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.kmsEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.kmsEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.kmsEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.kmsEquiv * activeUnitValue
          break
      }
      break
    case "kn":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.knotEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.knotEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.knotEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.knotEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.knotEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.knotEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.knotEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.knotEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.knotEquiv * activeUnitValue
          break
      }
      break
    case "fps":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.fpsEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.fpsEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.fpsEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.fpsEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.fpsEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.fpsEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.fpsEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.fpsEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.fpsEquiv * activeUnitValue
          break
      }
      break
    case "ips":
      switch (activeUnit2) {
        case "c":
          convertedValue =
            conversionRates.oneLightspeed.ipsEquiv * activeUnitValue
          break
        case "Ma":
          convertedValue = conversionRates.oneMach.ipsEquiv * activeUnitValue
          break
        case "m/s":
          convertedValue =
            conversionRates.oneMeterPerSec.ipsEquiv * activeUnitValue
          break
        case "km/s":
          convertedValue =
            conversionRates.oneKilometerPerSec.ipsEquiv * activeUnitValue
          break
        case "kn":
          convertedValue = conversionRates.oneKnot.ipsEquiv * activeUnitValue
          break
        case "mph":
          convertedValue =
            conversionRates.oneMilePerHour.ipsEquiv * activeUnitValue
          break
        case "fps":
          convertedValue =
            conversionRates.oneFootPerSec.ipsEquiv * activeUnitValue
          break
        case "ips":
          convertedValue =
            conversionRates.oneInchPerSec.ipsEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneKilometerPerHour.ipsEquiv * activeUnitValue
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
  speedData.activeDropdown = dropdown
}

const setActiveUnitTop = (unit) => {
  speedData.topActiveUnit = unit
  storeConverterDataLocally(speedData, numberInput)
}

const setActiveUnitBottom = (unit) => {
  speedData.bottomActiveUnit = unit
  storeConverterDataLocally(speedData, numberInput)
}

const clear = () => {
  if (!speedData.topUnitValue && !speedData.bottomUnitValue) return

  clearAll(speedData, numberInput)
}

const backspace = () => {
  if (!speedData.topUnitValue && !speedData.bottomUnitValue) return

  clearChars(speedData, numberInput)
}
</script>
