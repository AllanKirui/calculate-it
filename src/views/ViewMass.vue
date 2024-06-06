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
        :active-unit="massData.topActiveUnit"
        @setActiveUnit="setActiveUnitTop"
      />
      <UnitValue
        dropdown-owner="top"
        :converter-data="massData"
        @setActiveDropdown="setActiveDropdown"
      />
    </div>

    <!-- Bottom Units -->
    <div class="dropdown-container">
      <TheDropdown
        :calc-units="calcUnits"
        :active-unit="massData.bottomActiveUnit"
        @setActiveUnit="setActiveUnitBottom"
      />
      <UnitValue
        dropdown-owner="bottom"
        :converter-data="massData"
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
  tonne: {
    shortName: "t",
    longName: "Tonne t"
  },
  kilogram: {
    shortName: "kg",
    longName: "Kilogram kg"
  },
  pound: {
    shortName: "lb",
    longName: "Pound lb"
  },
  gram: {
    shortName: "g",
    longName: "Gram g"
  },
  milligram: {
    shortName: "mg",
    longName: "Milligram mg"
  },
  ounce: {
    shortName: "oz",
    longName: "Ounce oz"
  },
  carat: {
    shortName: "ct",
    longName: "Carat ct"
  },
  stone: {
    shortName: "st",
    longName: "Stone st"
  }
})

// reactive data object for related mass data
const massData = reactive({
  name: "massData",
  topActiveUnit: "kg",
  bottomActiveUnit: "lb",
  topUnitName: "Kilogram",
  bottomUnitName: "Pound",
  hasConvertedToTopEquiv: false,
  hasConvertedToBottomEquiv: false,
  topUnitValue: "",
  bottomUnitValue: "",
  activeDropdown: "top",
  defaultResult: 0
})

// non reactive data object for units and their conversion rates
const conversionRates = {
  oneTonne: {
    tonneEquiv: 1,
    kilogramEquiv: 1000,
    gramEquiv: 1000000,
    milligramEquiv: 1000000000,
    poundEquiv: 2204.62262,
    ounceEquiv: 35273.9619,
    caratEquiv: 5000000,
    stoneEquiv: 157.473044
  },
  oneKilo: {
    kilogramEquiv: 1,
    gramEquiv: 1000,
    poundEquiv: 2.20462262,
    ounceEquiv: 35.2739619,
    tonneEquiv: 0.001,
    milligramEquiv: 1000000,
    caratEquiv: 5000,
    stoneEquiv: 0.157473044
  },
  oneGram: {
    gramEquiv: 1,
    kilogramEquiv: 0.001,
    poundEquiv: 0.00220462262,
    ounceEquiv: 0.0352739619,
    tonneEquiv: 0.000001,
    milligramEquiv: 1000,
    caratEquiv: 5,
    stoneEquiv: 0.000157473044
  },
  oneMilligram: {
    milligramEquiv: 1,
    kilogramEquiv: 0.000001,
    poundEquiv: 0.00000220462262,
    ounceEquiv: 0.0000352739619,
    tonneEquiv: 0.000000001,
    gramEquiv: 0.001,
    caratEquiv: 0.005,
    stoneEquiv: 0.000000157473044
  },
  onePound: {
    poundEquiv: 1,
    kilogramEquiv: 0.45359237,
    gramEquiv: 453.59237,
    ounceEquiv: 16,
    tonneEquiv: 0.00045359237,
    milligramEquiv: 453592.37,
    caratEquiv: 2267.96185,
    stoneEquiv: 0.0714285714
  },
  oneOunce: {
    ounceEquiv: 1,
    poundEquiv: 0.0625,
    kilogramEquiv: 0.0283495231,
    gramEquiv: 28.3495231,
    tonneEquiv: 0.0000283495231,
    milligramEquiv: 28349.5231,
    caratEquiv: 141.747616,
    stoneEquiv: 0.00446428571
  },
  oneCarat: {
    caratEquiv: 1,
    poundEquiv: 0.000440924524,
    kilogramEquiv: 0.0002,
    gramEquiv: 0.2,
    tonneEquiv: 0.0000002,
    milligramEquiv: 200,
    ounceEquiv: 0.00705479239,
    stoneEquiv: 0.0000314946089
  },
  oneStone: {
    stoneEquiv: 1,
    poundEquiv: 14,
    kilogramEquiv: 6.35029318,
    gramEquiv: 6350.29318,
    tonneEquiv: 0.00635029318,
    milligramEquiv: 6350293.18,
    ounceEquiv: 224,
    caratEquiv: 31751.4659
  }
}

// when a user changes units, update the unit name below the result
watch(
  () => massData.topActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "g":
        massData.topUnitName = "Gram"
        break
      case "lb":
        massData.topUnitName = "Pound"
        break
      case "oz":
        massData.topUnitName = "Ounce"
        break
      case "t":
        massData.topUnitName = "Tonne"
        break
      case "mg":
        massData.topUnitName = "Milligram"
        break
      case "ct":
        massData.topUnitName = "Carat"
        break
      case "st":
        massData.topUnitName = "Stone"
        break
      default:
        massData.topUnitName = "Kilogram"
        break
    }

    if (!massData.topUnitValue && !massData.bottomUnitValue) return

    // if there was a previous unit value and the unit type changes
    // re-calculate the equivalent e.g. if top unit is 'kg' with a value of 5
    // and bottom unit is 'lb', and then top unit gets changed to 'g',
    // re-calculate the value of 5 grams to pounds
    if (massData.activeDropdown === "top") {
      massData.bottomUnitValue = convertTopUnitToBottomEquiv(
        massData,
        massData.topUnitValue,
        convertValues
      )
      massData.hasConvertedToTopEquiv = true
    } else {
      massData.topUnitValue = convertBottomUnitToTopEquiv(
        massData,
        massData.bottomUnitValue,
        convertValues
      )
      massData.hasConvertedToBottomEquiv = true
    }

    convertResultToExponential(massData)
    storeConverterDataLocally(massData, numberInput)
  }
)

watch(
  () => massData.bottomActiveUnit,
  (newUnit) => {
    switch (newUnit) {
      case "kg":
        massData.bottomUnitName = "Kilogram"
        break
      case "g":
        massData.bottomUnitName = "Gram"
        break
      case "oz":
        massData.bottomUnitName = "Ounce"
        break
      case "t":
        massData.bottomUnitName = "Tonne"
        break
      case "mg":
        massData.bottomUnitName = "Milligram"
        break
      case "ct":
        massData.bottomUnitName = "Carat"
        break
      case "st":
        massData.bottomUnitName = "Stone"
        break
      default:
        massData.bottomUnitName = "Pound"
        break
    }

    if (!massData.topUnitValue && !massData.bottomUnitValue) return

    if (massData.activeDropdown === "bottom") {
      massData.topUnitValue = convertBottomUnitToTopEquiv(
        massData,
        massData.bottomUnitValue,
        convertValues
      )
      massData.hasConvertedToBottomEquiv = true
    } else {
      massData.bottomUnitValue = convertTopUnitToBottomEquiv(
        massData,
        massData.topUnitValue,
        convertValues
      )
      massData.hasConvertedToTopEquiv = true
    }

    convertResultToExponential(massData)
    storeConverterDataLocally(massData, numberInput)
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => massData.topUnitValue,
  (newValue) => {
    if (massData.hasConvertedToBottomEquiv) return

    // calculate the value for the bottom unit
    massData.bottomUnitValue = convertTopUnitToBottomEquiv(
      massData,
      newValue,
      convertValues
    )
    convertResultToExponential(massData)
    storeConverterDataLocally(massData, numberInput)
  }
)

watch(
  () => massData.bottomUnitValue,
  (newValue) => {
    if (massData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    massData.topUnitValue = convertBottomUnitToTopEquiv(
      massData,
      newValue,
      convertValues
    )
    convertResultToExponential(massData)
    storeConverterDataLocally(massData, numberInput)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => massData.activeDropdown,
  (newValue) => {
    massData.hasConvertedToTopEquiv = false
    massData.hasConvertedToBottomEquiv = false

    // reset the value that was previously entered for a unit
    numberInput.topUnit = ""
    numberInput.bottomUnit = ""

    storeConverterDataLocally(massData, numberInput)
  }
)

// retrieve any locally stored converter data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredConverterData(massData, numberInput)
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(massData, numberInput, buttonsContainerRef)
  showRippleEffectOnButtons(buttonsContainerRef)

  // when the component is mounted, set 1 as the value of the active dropdown
  if (massData.topUnitValue === "" && massData.bottomUnitValue === "") {
    appendNumber(1)
  }
})

onBeforeUnmount(() => {
  removeListenerForKeyboardInputs(massData, numberInput, buttonsContainerRef)
})

/*
  Methods
*/
const appendNumber = (number) => {
  appendNumberToConverter(number, massData, numberInput)
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
        case "t":
          convertedValue = conversionRates.oneTonne.poundEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.poundEquiv * activeUnitValue
          break
        case "ct":
          convertedValue = conversionRates.oneCarat.poundEquiv * activeUnitValue
          break
        case "st":
          convertedValue = conversionRates.oneStone.poundEquiv * activeUnitValue
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
        case "t":
          convertedValue = conversionRates.oneTonne.gramEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.gramEquiv * activeUnitValue
          break
        case "ct":
          convertedValue = conversionRates.oneCarat.gramEquiv * activeUnitValue
          break
        case "st":
          convertedValue = conversionRates.oneStone.gramEquiv * activeUnitValue
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
        case "t":
          convertedValue = conversionRates.oneTonne.ounceEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.ounceEquiv * activeUnitValue
          break
        case "ct":
          convertedValue = conversionRates.oneCarat.ounceEquiv * activeUnitValue
          break
        case "st":
          convertedValue = conversionRates.oneStone.ounceEquiv * activeUnitValue
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
        case "t":
          convertedValue =
            conversionRates.oneTonne.kilogramEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.kilogramEquiv * activeUnitValue
          break
        case "ct":
          convertedValue =
            conversionRates.oneCarat.kilogramEquiv * activeUnitValue
          break
        case "st":
          convertedValue =
            conversionRates.oneStone.kilogramEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.onePound.kilogramEquiv * activeUnitValue
          break
      }
      break
    case "t":
      switch (activeUnit2) {
        case "kg":
          convertedValue = conversionRates.oneKilo.tonneEquiv * activeUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.tonneEquiv * activeUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.tonneEquiv * activeUnitValue
          break
        case "lb":
          convertedValue = conversionRates.onePound.tonneEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.tonneEquiv * activeUnitValue
          break
        case "ct":
          convertedValue = conversionRates.oneCarat.tonneEquiv * activeUnitValue
          break
        case "st":
          convertedValue = conversionRates.oneStone.tonneEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneTonne.tonneEquiv * activeUnitValue
          break
      }
      break
    case "mg":
      switch (activeUnit2) {
        case "kg":
          convertedValue =
            conversionRates.oneKilo.milligramEquiv * activeUnitValue
          break
        case "g":
          convertedValue =
            conversionRates.oneGram.milligramEquiv * activeUnitValue
          break
        case "oz":
          convertedValue =
            conversionRates.oneOunce.milligramEquiv * activeUnitValue
          break
        case "t":
          convertedValue =
            conversionRates.oneTonne.milligramEquiv * activeUnitValue
          break
        case "lb":
          convertedValue =
            conversionRates.onePound.milligramEquiv * activeUnitValue
          break
        case "ct":
          convertedValue =
            conversionRates.oneCarat.milligramEquiv * activeUnitValue
          break
        case "st":
          convertedValue =
            conversionRates.oneStone.milligramEquiv * activeUnitValue
          break
        default:
          convertedValue =
            conversionRates.oneMilligram.milligramEquiv * activeUnitValue
          break
      }
      break
    case "ct":
      switch (activeUnit2) {
        case "kg":
          convertedValue = conversionRates.oneKilo.caratEquiv * activeUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.caratEquiv * activeUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.caratEquiv * activeUnitValue
          break
        case "t":
          convertedValue = conversionRates.oneTonne.caratEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.caratEquiv * activeUnitValue
          break
        case "lb":
          convertedValue = conversionRates.onePound.caratEquiv * activeUnitValue
          break
        case "st":
          convertedValue = conversionRates.oneStone.caratEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneCarat.caratEquiv * activeUnitValue
          break
      }
      break
    case "st":
      switch (activeUnit2) {
        case "kg":
          convertedValue = conversionRates.oneKilo.stoneEquiv * activeUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.stoneEquiv * activeUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.stoneEquiv * activeUnitValue
          break
        case "t":
          convertedValue = conversionRates.oneTonne.stoneEquiv * activeUnitValue
          break
        case "mg":
          convertedValue =
            conversionRates.oneMilligram.stoneEquiv * activeUnitValue
          break
        case "ct":
          convertedValue = conversionRates.oneCarat.stoneEquiv * activeUnitValue
          break
        case "lb":
          convertedValue = conversionRates.onePound.stoneEquiv * activeUnitValue
          break
        default:
          convertedValue = conversionRates.oneStone.stoneEquiv * activeUnitValue
          break
      }
      break
  }

  return setNumberOfFractionDigits(convertedValue)
}

const setActiveDropdown = (dropdown) => {
  massData.activeDropdown = dropdown
}

const setActiveUnitTop = (unit) => {
  massData.topActiveUnit = unit
  storeConverterDataLocally(massData, numberInput)
}

const setActiveUnitBottom = (unit) => {
  massData.bottomActiveUnit = unit
  storeConverterDataLocally(massData, numberInput)
}

const clear = () => {
  if (!massData.topUnitValue && !massData.bottomUnitValue) return

  clearAll(massData, numberInput)
}

const backspace = () => {
  if (!massData.topUnitValue && !massData.bottomUnitValue) return

  clearChars(massData, numberInput)
}
</script>
