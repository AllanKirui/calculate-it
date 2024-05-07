<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
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
  <div class="dropdown-container bottom-dropdown">
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
  ounce: {
    shortName: "oz",
    longName: "Ounce oz"
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
        massData.topUnitName = "Gram"
        break
      case "lb":
        massData.topUnitName = "Pound"
        break
      case "oz":
        massData.topUnitName = "Ounce"
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
