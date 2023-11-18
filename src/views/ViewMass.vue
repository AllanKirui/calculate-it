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
    <button @click="clear('all')" class="btn btn-clear row-span-2">AC</button>

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
import { ref, reactive, watch, inject } from "vue"

const removeCommas = inject("removeCommas")

const activeDropdown = ref("top")
const topActiveUnit = ref("kg")
const bottomActiveUnit = ref("lb")
const topUnitName = ref("Kilogram")
const bottomUnitName = ref("Pound")

// integer part of a float i.e 3.142 => 3
const topUnitIntegerPortion = ref("")
const bottomUnitIntegerPortion = ref("")

// reactive data object for related math data
const massData = reactive({
  hasTopUnitChanged: false,
  hasBottomUnitChanged: false,
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
    if (massData.hasBottomUnitChanged) return

    // calculate the value for the bottom unit
    massData.bottomUnitValue = convertTopUnitToBottomEquiv(newValue)
  }
)

watch(
  () => massData.bottomUnitValue,
  (newValue) => {
    if (massData.hasTopUnitChanged) return

    // calculate the value for the top unit
    massData.topUnitValue = convertBottomUnitToTopEquiv(newValue)
  }
)

/*
  Methods
*/
const appendNumber = (number) => {
  // return if zero is clicked when either the top or bottom unit values are zero
  // and if the number already contains a decimal point return
  if (activeDropdown.value === "top") {
    if (number === 0 && !massData.topUnitValue) return
    if (number === "." && topUnitIntegerPortion.value.includes(".")) return
  } else {
    if (number === 0 && !massData.bottomUnitValue) return
    if (number === "." && bottomUnitIntegerPortion.value.includes(".")) return
  }

  // convert the number to a string
  let stringNumber = number.toString()
  if (activeDropdown.value === "top") {
    topUnitIntegerPortion.value += stringNumber
  } else {
    bottomUnitIntegerPortion.value += stringNumber
  }

  // get the Integer and Decimal parts of a number e.g 3.142
  let integerNumbers
  let decimalNumbers
  let integerDisplay

  if (activeDropdown.value === "top") {
    integerNumbers = removeCommas(topUnitIntegerPortion.value.split(".")[0]) // integer = 3
    decimalNumbers = topUnitIntegerPortion.value.split(".")[1] // decimal = 142
  } else {
    integerNumbers = removeCommas(bottomUnitIntegerPortion.value.split(".")[0])
    decimalNumbers = bottomUnitIntegerPortion.value.split(".")[1]
  }

  // check if integerNumbers holds an actual number and convert that to a string
  if (isNaN(integerNumbers)) {
    integerDisplay = ""
  } else {
    integerDisplay = integerNumbers.toLocaleString("en", {
      maximumFractionDigits: 0
    })
  }

  // if the decimal point is the first button to be clicked add a zero before it
  if (number === "." && isNaN(integerNumbers)) {
    if (activeDropdown.value === "top") {
      topUnitIntegerPortion.value = "0."
      integerDisplay = "0"
    } else {
      bottomUnitIntegerPortion.value = "0."
      integerDisplay = "0"
    }
  }

  // handle displaying any decimal digits
  if (decimalNumbers != null) {
    if (activeDropdown.value === "top") {
      massData.topUnitValue = `${integerDisplay}.${decimalNumbers}`
    } else {
      massData.bottomUnitValue = `${integerDisplay}.${decimalNumbers}`
    }
  } else {
    if (activeDropdown.value === "top") {
      massData.topUnitValue = integerDisplay
    } else {
      massData.bottomUnitValue = integerDisplay
    }
  }
}

const convertTopUnitToBottomEquiv = (unitValue) => {
  let convertedValue

  // convert the string number to a number
  let topUnitValue = removeCommas(unitValue)

  // check the active unit on the bottom dropdown
  let topUnit = topActiveUnit.value
  let bottomUnit = bottomActiveUnit.value

  // convert the bottom unit based on the active units on the top dropdown
  switch (bottomUnit) {
    case "lb":
      switch (topUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.poundEquiv * topUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.poundEquiv * topUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.poundEquiv * topUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.poundEquiv * topUnitValue
          break
      }
      break
    case "g":
      switch (topUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.gramEquiv * topUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.gramEquiv * topUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.gramEquiv * topUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.gramEquiv * topUnitValue
          break
      }
      break
    case "oz":
      switch (topUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.ounceEquiv * topUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.ounceEquiv * topUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.ounceEquiv * topUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.ounceEquiv * topUnitValue
          break
      }
      break
    case "kg":
      switch (topUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.kilogramEquiv * topUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.kilogramEquiv * topUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.kilogramEquiv * topUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.kilogramEquiv * topUnitValue
          break
      }
      break
  }

  convertedValue = convertedValue.toLocaleString("en", {
    maximumFractionDigits: 7
  })

  return !isNaN(parseFloat(convertedValue))
    ? convertedValue
    : massData.defaultResult
}

const convertBottomUnitToTopEquiv = (unitValue) => {
  let convertedValue

  // convert the string number to a number
  let bottomUnitValue = removeCommas(unitValue)

  // check the active unit on the top dropdown
  let topUnit = topActiveUnit.value
  let bottomUnit = bottomActiveUnit.value

  // convert the bottom unit based on the active units on the top dropdown
  switch (topUnit) {
    case "lb":
      switch (bottomUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.poundEquiv * bottomUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.poundEquiv * bottomUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.poundEquiv * bottomUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.poundEquiv * bottomUnitValue
          break
      }
      break
    case "g":
      switch (bottomUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.gramEquiv * bottomUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.gramEquiv * bottomUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.gramEquiv * bottomUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.gramEquiv * bottomUnitValue
          break
      }
      break
    case "oz":
      switch (bottomUnit) {
        case "kg":
          convertedValue = conversionRates.oneKilo.ounceEquiv * bottomUnitValue
          break
        case "g":
          convertedValue = conversionRates.oneGram.ounceEquiv * bottomUnitValue
          break
        case "oz":
          convertedValue = conversionRates.oneOunce.ounceEquiv * bottomUnitValue
          break
        default:
          convertedValue = conversionRates.onePound.ounceEquiv * bottomUnitValue
          break
      }
      break
    case "kg":
      switch (bottomUnit) {
        case "kg":
          convertedValue =
            conversionRates.oneKilo.kilogramEquiv * bottomUnitValue
          break
        case "g":
          convertedValue =
            conversionRates.oneGram.kilogramEquiv * bottomUnitValue
          break
        case "oz":
          convertedValue =
            conversionRates.oneOunce.kilogramEquiv * bottomUnitValue
          break
        default:
          convertedValue =
            conversionRates.onePound.kilogramEquiv * bottomUnitValue
          break
      }
      break
  }

  convertedValue = convertedValue.toLocaleString("en", {
    maximumFractionDigits: 7
  })

  return !isNaN(parseFloat(convertedValue))
    ? convertedValue
    : massData.defaultResult
}

const setActiveUnitTop = (unit) => {
  topActiveUnit.value = unit
}

const setActiveUnitBottom = (unit) => {
  bottomActiveUnit.value = unit
}
</script>
