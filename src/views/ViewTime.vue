<template>
  <!-- The Output -->
  <div class="display-container">
    <!-- Background Text -->
    <div class="bg-text">
      <span>{{ $route.name }}</span>
    </div>

    <!-- Dropdowns containing unit options -->
    <!-- Top Units -->
    <div class="dropdown-container">
      <TheDropdown
        :calc-units="calcUnits"
        :active-unit="timeData.topActiveUnit"
        @setActiveUnit="setActiveUnitTop"
      />
      <UnitValue
        dropdown-owner="top"
        :converter-data="timeData"
        @setActiveDropdown="setActiveDropdown"
      />
    </div>

    <!-- Bottom Units -->
    <div class="dropdown-container">
      <TheDropdown
        :calc-units="calcUnits"
        :active-unit="timeData.bottomActiveUnit"
        @setActiveUnit="setActiveUnitBottom"
      />
      <UnitValue
        dropdown-owner="bottom"
        :converter-data="timeData"
        @setActiveDropdown="setActiveDropdown"
      />
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
const convertResultToExponential = inject("convertResultToExponential")
const setNumberOfFractionDigits = inject("setNumberOfFractionDigits")

// convert the template ref into a data ref
const buttonsContainerRef = ref(null)

// number input for the top and bottom units
const numberInput = reactive({
  topUnit: "",
  bottomUnit: ""
})

const calcUnits = ref({
  year: {
    shortName: "y",
    longName: "Year y"
  },
  week: {
    shortName: "wk",
    longName: "Week wk"
  },
  day: {
    shortName: "d",
    longName: "Day d"
  },
  hour: {
    shortName: "h",
    longName: "Hour h"
  },
  minute: {
    shortName: "min",
    longName: "Minute min"
  },
  second: {
    shortName: "s",
    longName: "Second s"
  },
  millisecond: {
    shortName: "ms",
    longName: "Millisecond ms"
  }
})

// reactive data object for related time data
const timeData = reactive({
  name: "timeData",
  topActiveUnit: "y",
  bottomActiveUnit: "wk",
  topUnitName: "Year",
  bottomUnitName: "Week",
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  activeDropdown: "top",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneYear: {
    yearEquiv: 1,
    weekEquiv: 52.1428571,
    dayEquiv: 365,
    hourEquiv: 8760,
    minuteEquiv: 525600,
    secondEquiv: 31536000,
    millisecondEquiv: 31536000000
  },
  oneWeek: {
    weekEquiv: 1,
    yearEquiv: 0.0191780822,
    dayEquiv: 7,
    hourEquiv: 168,
    minuteEquiv: 10080,
    secondEquiv: 604800,
    millisecondEquiv: 604800000
  },
  oneDay: {
    dayEquiv: 1,
    yearEquiv: 0.00273972603,
    weekEquiv: 0.142857143,
    hourEquiv: 24,
    minuteEquiv: 1440,
    secondEquiv: 86400,
    millisecondEquiv: 86400000
  },
  oneHour: {
    hourEquiv: 1,
    yearEquiv: 0.000114155251,
    weekEquiv: 0.00595238095,
    dayEquiv: 0.0416666667,
    minuteEquiv: 60,
    secondEquiv: 3600,
    millisecondEquiv: 3600000
  },
  oneMinute: {
    minuteEquiv: 1,
    yearEquiv: 0.0000190258752,
    weekEquiv: 0.000992063492,
    dayEquiv: 0.000694444444,
    hourEquiv: 0.0166666667,
    secondEquiv: 60,
    millisecondEquiv: 60000
  },
  oneSecond: {
    secondEquiv: 1,
    yearEquiv: 0.00000031709792,
    weekEquiv: 0.0000165343915,
    dayEquiv: 0.000115740741,
    hourEquiv: 0.000277777778,
    minuteEquiv: 0.166666667,
    millisecondEquiv: 1000
  },
  oneMillisecond: {
    millisecondEquiv: 1,
    yearEquiv: 0.00000000031709792,
    weekEquiv: 0.0000000165343915,
    dayEquiv: 0.000000115740741,
    hourEquiv: 0.00000277777778,
    minuteEquiv: 0.000166666667,
    secondEquiv: 0.001
  }
}

/*
 Watchers
*/
// when a user changes units, update the unit name below the result
watch(
  () => timeData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "wk":
        timeData.topUnitName = "Week"
        break
      case "d":
        timeData.topUnitName = "Day"
        break
      case "h":
        timeData.topUnitName = "Hour"
        break
      case "min":
        timeData.topUnitName = "Minute"
        break
      case "s":
        timeData.topUnitName = "Second"
        break
      case "ms":
        timeData.topUnitName = "Millisecond"
        break
      default:
        timeData.topUnitName = "Year"
        break
    }

    if (!timeData.topUnitValue && !timeData.bottomUnitValue) return

    // if there was a previous unit value and the unit type changes
    // re-calculate the equivalent e.g. if top unit is 'kg' with a value of 5
    // and bottom unit is 'lb', and then top unit gets changed to 'g',
    // re-calculate the value of 5 grams to pounds
    if (timeData.activeDropdown === "top") {
      timeData.bottomUnitValue = convertTopUnitToBottomEquiv(
        timeData,
        timeData.topUnitValue,
        convertValues
      )
      timeData.hasConvertedToTopEquiv = true
    } else {
      timeData.topUnitValue = convertBottomUnitToTopEquiv(
        timeData,
        timeData.bottomUnitValue,
        convertValues
      )
      timeData.hasConvertedToBottomEquiv = true
    }

    convertResultToExponential(timeData)
    storeConverterDataLocally(timeData, numberInput)
  }
)

watch(
  () => timeData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "y":
        timeData.bottomUnitName = "Year"
        break
      case "d":
        timeData.bottomUnitName = "Day"
        break
      case "h":
        timeData.bottomUnitName = "Hour"
        break
      case "min":
        timeData.bottomUnitName = "Minute"
        break
      case "s":
        timeData.bottomUnitName = "Second"
        break
      case "ms":
        timeData.bottomUnitName = "Millisecond"
        break
      default:
        timeData.bottomUnitName = "Week"
        break
    }

    if (!timeData.topUnitValue && !timeData.bottomUnitValue) return

    if (timeData.activeDropdown === "bottom") {
      timeData.topUnitValue = convertBottomUnitToTopEquiv(
        timeData,
        timeData.bottomUnitValue,
        convertValues
      )
      timeData.hasConvertedToBottomEquiv = true
    } else {
      timeData.bottomUnitValue = convertTopUnitToBottomEquiv(
        timeData,
        timeData.topUnitValue,
        convertValues
      )
      timeData.hasConvertedToTopEquiv = true
    }

    convertResultToExponential(timeData)
    storeConverterDataLocally(timeData, numberInput)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => timeData.topUnitValue,
  (newValue) => {
    if (timeData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    timeData.bottomUnitValue = convertTopUnitToBottomEquiv(
      timeData,
      newValue,
      convertValues
    )
    convertResultToExponential(timeData)
    storeConverterDataLocally(timeData, numberInput)
  }
)

watch(
  () => timeData.bottomUnitValue,
  (newValue) => {
    if (timeData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    timeData.topUnitValue = convertBottomUnitToTopEquiv(
      timeData,
      newValue,
      convertValues
    )
    convertResultToExponential(timeData)
    storeConverterDataLocally(timeData, numberInput)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => timeData.activeDropdown,
  (newValue) => {
    timeData.hasConvertedToTopEquiv = false
    timeData.hasConvertedToBottomEquiv = false

    // reset the value that was previously entered for a unit
    numberInput.topUnit = ""
    numberInput.bottomUnit = ""

    storeConverterDataLocally(timeData, numberInput)
  }
)

/*
  Lifecycle Methods
*/
// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(timeData, numberInput)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(timeData, numberInput, buttonsContainerRef)
  showRippleEffectOnButtons(buttonsContainerRef)

  // when the component is mounted, set 1 as the value of the active dropdown
  if (timeData.topUnitValue === "" && timeData.bottomUnitValue === "") {
    appendNumber(1)
  }
})

onBeforeUnmount(() => {
  removeListenerForKeyboardInputs(timeData, numberInput, buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, timeData, numberInput)
}

const convertValues = (dropdown, unitValue) => {
  let activeUnitValue, activeUnit1, activeUnit2, convertedValue

  activeUnitValue = unitValue

  // check the active unit on the top and bottom dropdowns
  if (dropdown === "top") {
    activeUnit1 = timeData.bottomActiveUnit
    activeUnit2 = timeData.topActiveUnit
  } else {
    activeUnit1 = timeData.topActiveUnit
    activeUnit2 = timeData.bottomActiveUnit
  }

  // convert the top/bottom unit values based on the active
  // units on the adjacent dropdown
  switch (activeUnit1) {
    case "wk":
      switch (activeUnit2) {
        case "y":
          convertedValue = conversionRates.oneYear.weekEquiv * activeUnitValue
          break
        case "d":
          convertedValue = conversionRates.oneDay.weekEquiv * activeUnitValue
          break
        case "h":
          convertedValue = conversionRates.oneHour.weekEquiv * activeUnitValue
          break
        case "min":
          convertedValue = conversionRates.oneMinute.weekEquiv * activeUnitValue
          break
        case "s":
          convertedValue = conversionRates.oneSecond.weekEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.weekEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneWeek.weekEquiv * activeUnitValue
          break
      }
      break
    case "y":
      switch (activeUnit2) {
        case "y":
          convertedValue = conversionRates.oneYear.yearEquiv * activeUnitValue
          break
        case "d":
          convertedValue = conversionRates.oneDay.yearEquiv * activeUnitValue
          break
        case "h":
          convertedValue = conversionRates.oneHour.yearEquiv * activeUnitValue
          break
        case "min":
          convertedValue = conversionRates.oneMinute.yearEquiv * activeUnitValue
          break
        case "s":
          convertedValue = conversionRates.oneSecond.yearEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.yearEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneWeek.yearEquiv * activeUnitValue
          break
      }
      break
    case "d":
      switch (activeUnit2) {
        case "y":
          convertedValue = conversionRates.oneYear.dayEquiv * activeUnitValue
          break
        case "d":
          convertedValue = conversionRates.oneDay.dayEquiv * activeUnitValue
          break
        case "h":
          convertedValue = conversionRates.oneHour.dayEquiv * activeUnitValue
          break
        case "min":
          convertedValue = conversionRates.oneMinute.dayEquiv * activeUnitValue
          break
        case "s":
          convertedValue = conversionRates.oneSecond.dayEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.dayEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneWeek.dayEquiv * activeUnitValue
          break
      }
      break
    case "h":
      switch (activeUnit2) {
        case "y":
          convertedValue = conversionRates.oneYear.hourEquiv * activeUnitValue
          break
        case "d":
          convertedValue = conversionRates.oneDay.hourEquiv * activeUnitValue
          break
        case "h":
          convertedValue = conversionRates.oneHour.hourEquiv * activeUnitValue
          break
        case "min":
          convertedValue = conversionRates.oneMinute.hourEquiv * activeUnitValue
          break
        case "s":
          convertedValue = conversionRates.oneSecond.hourEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.hourEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneWeek.hourEquiv * activeUnitValue
          break
      }
      break
    case "min":
      switch (activeUnit2) {
        case "y":
          convertedValue = conversionRates.oneYear.minuteEquiv * activeUnitValue
          break
        case "d":
          convertedValue = conversionRates.oneDay.minuteEquiv * activeUnitValue
          break
        case "h":
          convertedValue = conversionRates.oneHour.minuteEquiv * activeUnitValue
          break
        case "min":
          convertedValue =
            conversionRates.oneMinute.minuteEquiv * activeUnitValue
          break
        case "s":
          convertedValue =
            conversionRates.oneSecond.minuteEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.minuteEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneWeek.minuteEquiv * activeUnitValue
          break
      }
      break
    case "s":
      switch (activeUnit2) {
        case "y":
          convertedValue = conversionRates.oneYear.secondEquiv * activeUnitValue
          break
        case "d":
          convertedValue = conversionRates.oneDay.secondEquiv * activeUnitValue
          break
        case "h":
          convertedValue = conversionRates.oneHour.secondEquiv * activeUnitValue
          break
        case "min":
          convertedValue =
            conversionRates.oneMinute.secondEquiv * activeUnitValue
          break
        case "s":
          convertedValue =
            conversionRates.oneSecond.secondEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.secondEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneWeek.secondEquiv * activeUnitValue
          break
      }
      break
    case "ms":
      switch (activeUnit2) {
        case "y":
          convertedValue =
            conversionRates.oneYear.millisecondEquiv * activeUnitValue
          break
        case "d":
          convertedValue =
            conversionRates.oneDay.millisecondEquiv * activeUnitValue
          break
        case "h":
          convertedValue =
            conversionRates.oneHour.millisecondEquiv * activeUnitValue
          break
        case "min":
          convertedValue =
            conversionRates.oneMinute.millisecondEquiv * activeUnitValue
          break
        case "s":
          convertedValue =
            conversionRates.oneSecond.millisecondEquiv * activeUnitValue
          break
        case "ms":
          convertedValue =
            conversionRates.oneMillisecond.millisecondEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneWeek.millisecondEquiv * activeUnitValue
          break
      }
      break
  }

  return setNumberOfFractionDigits(convertedValue)
}

const setActiveDropdown = (dropdown) => {
  timeData.activeDropdown = dropdown
}

const setActiveUnitTop = (unit) => {
  timeData.topActiveUnit = unit
  storeConverterDataLocally(timeData, numberInput)
}

const setActiveUnitBottom = (unit) => {
  timeData.bottomActiveUnit = unit
  storeConverterDataLocally(timeData, numberInput)
}

const clear = () => {
  if (!timeData.topUnitValue && !timeData.bottomUnitValue) return

  clearAll(timeData, numberInput)
}

const backspace = () => {
  if (!timeData.topUnitValue && !timeData.bottomUnitValue) return

  clearChars(timeData, numberInput)
}
</script>
