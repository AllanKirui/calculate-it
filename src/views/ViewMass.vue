<template>
  <!-- Dropdowns containing unit options -->
  <!-- Top Units -->
  <div class="dropdown-container top-dropdown">
    <TheDropdown
      :is-active="activeDropdown === 'top' ? true : false"
      :active-unit="topActiveUnit"
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
      :active-unit="bottomActiveUnit"
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
    ref="buttonsContainerRef"
    class="buttons-container md:min-h-full grid grid-cols-4 grid-rows-4 gap-2 text-2xl mt-3"
  >
    <!-- Row 1 Buttons -->
    <button @click="appendNumber(7)" class="btn btn-numbers">7</button>
    <button @click="appendNumber(8)" class="btn btn-numbers">8</button>
    <button @click="appendNumber(9)" class="btn btn-numbers">9</button>
    <button @click="clear" class="btn btn-clear row-span-2">AC</button>

    <!-- Row 2 Buttons -->
    <button @click="appendNumber(4)" class="btn btn-numbers">4</button>
    <button @click="appendNumber(5)" class="btn btn-numbers">5</button>
    <button @click="appendNumber(6)" class="btn btn-numbers">6</button>

    <!-- Row 3 Buttons -->
    <button @click="appendNumber(1)" class="btn btn-numbers">1</button>
    <button @click="appendNumber(2)" class="btn btn-numbers">2</button>
    <button @click="appendNumber(3)" class="btn btn-numbers">3</button>
    <button @click="backspace" class="btn btn-operators row-span-2">
      &laquo;
    </button>

    <!-- Row 4 Buttons -->
    <button @click="appendNumber(0)" class="col-start-2 btn btn-numbers">
      0
    </button>
    <button @click="appendNumber('.')" class="btn btn-numbers">.</button>
  </div>
</template>

<script setup>
import TheDropdown from "@/components/ui/TheDropdown.vue"
import { ref, reactive, watch, inject, onMounted } from "vue"

const appendNumberToConverter = inject("appendNumber")
const removeCommas = inject("removeCommas")
const clearAll = inject("clearAll")
const clearChars = inject("clearChars")
const listenForKeyboardInputs = inject("listenForKeyboardInputs")

const activeDropdown = ref("top")
const topActiveUnit = ref("kg")
const bottomActiveUnit = ref("lb")
const topUnitName = ref("Kilogram")
const bottomUnitName = ref("Pound")

// integer part of a float i.e 3.142 => 3
const integerPortion = reactive({
  topUnit: "",
  bottomUnit: ""
})

// reactive data object for related math data
const massData = reactive({
  hasSwitchedActiveDropdown: false,
  hasTopUnitChanged: false,
  hasBottomUnitChanged: false,
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
  () => topActiveUnit.value,
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

    massData.hasTopUnitChanged = true

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
  }
)

watch(
  () => bottomActiveUnit.value,
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

    massData.hasBottomUnitChanged = true

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
  }
)

// when the value of a unit changes, calculate the equivalent value for the corresponding unit
watch(
  () => massData.topUnitValue,
  (newValue) => {
    if (massData.hasBottomUnitChanged || massData.hasConvertedToBottomEquiv)
      return

    // calculate the value for the bottom unit
    massData.bottomUnitValue = convertTopUnitToBottomEquiv(newValue)
  }
)

watch(
  () => massData.bottomUnitValue,
  (newValue) => {
    if (massData.hasTopUnitChanged || massData.hasConvertedToTopEquiv) return

    // calculate the value for the top unit
    massData.topUnitValue = convertBottomUnitToTopEquiv(newValue)
  }
)

// when the activeDropdown changes, update the following flags
watch(
  () => activeDropdown.value,
  (newValue) => {
    massData.hasSwitchedActiveDropdown = true
    massData.hasConvertedToTopEquiv = false
    massData.hasConvertedToBottomEquiv = false
    massData.hasTopUnitChanged = false
    massData.hasBottomUnitChanged = false

    // reset the value that was previously entered for a unit
    integerPortion.topUnit = ""
    integerPortion.bottomUnit = ""
  }
)

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  listenForKeyboardInputs(activeDropdown, massData, integerPortion)
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
    activeUnit1 = bottomActiveUnit.value
    activeUnit2 = topActiveUnit.value
  } else {
    activeUnit1 = topActiveUnit.value
    activeUnit2 = bottomActiveUnit.value
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
  topActiveUnit.value = unit
}

const setActiveUnitBottom = (unit) => {
  bottomActiveUnit.value = unit
}

const clear = () => {
  if (!massData.topUnitValue && !massData.bottomUnitValue) return

  clearAll(massData, integerPortion)
}

const backspace = () => {
  if (!massData.topUnitValue && !massData.bottomUnitValue) return

  // the hasConvertedTo... flag prevents the watcher methods above
  // for topUnitValue and bottomUnitValue from running twice
  if (activeDropdown.value === "top") {
    massData.hasConvertedToTopEquiv = true
  } else if (activeDropdown.value === "bottom") {
    massData.hasConvertedToBottomEquiv = true
  }

  clearChars(activeDropdown, massData, integerPortion)
}
</script>
