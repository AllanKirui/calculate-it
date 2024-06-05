<template>
  <!-- Calculator Container -->
  <div
    class="calculator-height relative max-w-3xl mx-auto md:h-auto md:mt-3 px-4 py-2 bg-navajo-white shadow-xl rounded-xl"
  >
    <RouterView />
  </div>
</template>

<script setup>
import { provide } from "vue"

/*
  Methods
*/
// method for appending numbers to the converters,
// different from the appendNumber() in ViewMath.vue
const appendNumber = (number, converter, numberInput) => {
  // the hasConvertedTo... flag prevents the watcher methods for topUnitValue
  // and bottomUnitValue from running twice inside child components
  if (converter.activeDropdown === "top") {
    converter.hasConvertedToTopEquiv = true
  } else if (converter.activeDropdown === "bottom") {
    converter.hasConvertedToBottomEquiv = true
  }

  // return if zero is clicked when either the top or bottom unit values are
  // zero (except in the Temperature Converter)
  // and if the number already contains a decimal point return
  if (converter.activeDropdown === "top") {
    if (
      number === 0 &&
      converter.name !== "temperatureData" &&
      !converter.topUnitValue
    )
      return
    if (number === "." && numberInput.topUnit.includes(".")) return
  } else {
    if (
      number === 0 &&
      converter.name !== "temperatureData" &&
      !converter.bottomUnitValue
    )
      return
    if (number === "." && numberInput.bottomUnit.includes(".")) return
  }

  // convert the number to a string
  let stringNumber = number.toString()
  if (converter.activeDropdown === "top") {
    numberInput.topUnit += stringNumber
  } else {
    numberInput.bottomUnit += stringNumber
  }

  // get the Integer and Decimal parts of a number e.g 3.142
  let integerNumbers
  let decimalNumbers
  let integerPortion

  if (converter.activeDropdown === "top") {
    integerNumbers = removeCommas(numberInput.topUnit.split(".")[0]) // integer = 3
    decimalNumbers = numberInput.topUnit.split(".")[1] // decimal = 142
  } else {
    integerNumbers = removeCommas(numberInput.bottomUnit.split(".")[0])
    decimalNumbers = numberInput.bottomUnit.split(".")[1]
  }

  // check if integerNumbers holds an actual number and convert that to a string
  if (isNaN(integerNumbers)) {
    integerPortion = ""
  } else {
    integerPortion = integerNumbers.toLocaleString("en", {
      maximumFractionDigits: 0
    })
  }

  // if the decimal point is the first button to be clicked add a zero before it
  if (number === "." && isNaN(integerNumbers)) {
    if (converter.activeDropdown === "top") {
      numberInput.topUnit = "0."
      integerPortion = "0"
    } else {
      numberInput.bottomUnit = "0."
      integerPortion = "0"
    }
  }

  // handle displaying any decimal digits
  if (decimalNumbers != null) {
    if (converter.activeDropdown === "top") {
      converter.topUnitValue = `${integerPortion}.${decimalNumbers}`
    } else {
      converter.bottomUnitValue = `${integerPortion}.${decimalNumbers}`
    }
  } else {
    if (converter.activeDropdown === "top") {
      converter.topUnitValue = integerPortion
    } else {
      converter.bottomUnitValue = integerPortion
    }
  }
}

const removeCommas = (stringNumber) => {
  if (!stringNumber.includes(",")) {
    return parseFloat(stringNumber)
  }

  let num = ""
  let stringArr = stringNumber.split(",")

  stringArr.forEach((string) => (num += string))

  return parseFloat(num)
}

const clearAll = (converter, numberInput) => {
  numberInput.topUnit = ""
  numberInput.bottomUnit = ""
  converter.topUnitValue = ""
  converter.bottomUnitValue = ""

  storeConverterDataLocally(converter, numberInput)
}

const clearChars = (converter, numberInput) => {
  // remove the last character from the expression shown on the calc display
  //
  // the hasConvertedTo... flag prevents the watcher methods
  // for topUnitValue and bottomUnitValue from running twice

  if (converter.activeDropdown === "top") {
    converter.topUnitValue = converter.topUnitValue.slice(0, -1)

    // reset the topUnitValue if it has a single digit value that is a zero
    if (converter.topUnitValue.length === 1 && converter.topUnitValue === "0")
      converter.topUnitValue = ""

    if (converter.topUnitValue === "") {
      numberInput.topUnit = converter.topUnitValue
      converter.hasConvertedToTopEquiv = true
      return
    }

    numberInput.topUnit = converter.topUnitValue
    converter.hasConvertedToTopEquiv = true
  }

  if (converter.activeDropdown === "bottom") {
    converter.bottomUnitValue = converter.bottomUnitValue.slice(0, -1)

    // reset the bottomUnitValue if it has a single digit value that is a zero
    if (
      converter.bottomUnitValue.length === 1 &&
      converter.bottomUnitValue === "0"
    )
      converter.bottomUnitValue = ""

    if (converter.bottomUnitValue === "") {
      numberInput.bottomUnit = converter.bottomUnitValue
      converter.hasConvertedToBottomEquiv = true
      return
    }

    numberInput.bottomUnit = converter.bottomUnitValue
    converter.hasConvertedToBottomEquiv = true
  }

  // remove any comma seperators and handle deleting chars from numbers with decimals
  if (
    converter.topUnitValue.includes(",") ||
    converter.bottomUnitValue.includes(",")
  ) {
    removeCommasFromUnitValues(converter, numberInput)
  }

  storeConverterDataLocally(converter, numberInput)
}

const removeCommasFromUnitValues = (converter, numberInput) => {
  let numWithoutCommas,
    numWithCommas = ""

  if (converter.activeDropdown === "top") {
    numWithoutCommas = removeCommas(converter.topUnitValue).toString()
  } else {
    numWithoutCommas = removeCommas(converter.bottomUnitValue).toString()
  }

  if (numWithoutCommas.includes(".")) {
    numWithCommas = parseFloat(numWithoutCommas).toLocaleString("en", {
      maximumFractionDigits: 7
    })
  } else {
    numWithCommas = parseFloat(numWithoutCommas).toLocaleString("en", {
      maximumFractionDigits: 0
    })
  }

  if (converter.activeDropdown === "top") {
    if (converter.topUnitValue.endsWith(".") && !numWithCommas.includes("."))
      numWithCommas += "."

    converter.topUnitValue = numWithCommas
    numberInput.topUnit = converter.topUnitValue
  } else {
    if (converter.bottomUnitValue.endsWith(".") && !numWithCommas.includes("."))
      numWithCommas += "."

    converter.bottomUnitValue = numWithCommas
    numberInput.bottomUnit = converter.bottomUnitValue
  }
}

const handleKeyboardInputs = (e, converter, numberInput, buttonsRef) => {
  // check which key was pressed and append the number or set operation
  const validKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "Backspace",
    "Delete"
  ]
  const keyPressed = e.key

  if (validKeys.includes(keyPressed)) {
    showRippleEffectOnButtons(buttonsRef, keyPressed)

    // clear characters when backspace is pressed, clear all when delete is pressed
    switch (keyPressed) {
      case "Backspace":
        clearChars(converter, numberInput)
        break
      case "Delete":
        showRippleEffectOnButtons(buttonsRef, "AC")
        clearAll(converter, numberInput)
        break
      default:
        appendNumber(keyPressed, converter, numberInput)
        break
    }
  }
}

const listenForKeyboardInputs = (converter, numberInput, buttonsRef) => {
  window.addEventListener("keyup", (e) =>
    handleKeyboardInputs(e, converter, numberInput, buttonsRef)
  )
}

const removeListenerForKeyboardInputs = (
  converter,
  numberInput,
  buttonsRef
) => {
  window.removeEventListener("keyup", (e) =>
    handleKeyboardInputs(e, converter, numberInput, buttonsRef)
  )
}

const showRippleEffectOnButtons = (buttonsRef, keyboardInput) => {
  if (!buttonsRef.value) return

  const buttons = []

  for (let i = 0; i < buttonsRef.value.children.length; i++) {
    buttons.push(buttonsRef.value.children[i])
  }

  buttons.forEach((btn) => {
    // show ripple effects on buttons when input is from the keyboard
    if (keyboardInput === btn.innerText) {
      setRippleForKeyboardInputs(btn)
      return
    } else if (keyboardInput === "Backspace" && btn.innerText === "«") {
      setRippleForKeyboardInputs(btn)
      return
    }

    // show ripple effects on buttons when input is from a click
    btn.addEventListener("click", (e) => setRippleForClickedButton(e))
  })
}

const setRippleForKeyboardInputs = (btn) => {
  const rect = btn.getBoundingClientRect()

  // create a circle element to fill the button
  const circle = document.createElement("span")
  circle.classList.add("circle")
  circle.style.top = `50%`
  circle.style.left = `50%`

  btn.appendChild(circle)

  setTimeout(() => circle.remove(), 350)
}

const setRippleForClickedButton = (e) => {
  const target = e.target
  const rect = target.getBoundingClientRect()

  // get the position of the mouse within the browser
  const x = e.clientX
  const y = e.clientY

  // get the position of the button's top and left edges
  const buttonTop = rect.top
  const buttonLeft = rect.left

  // calculate the position of the mouse within the button
  const xInside = x - buttonLeft
  const yInside = y - buttonTop

  // create a circle element to fill the button
  const circle = document.createElement("span")
  circle.classList.add("circle")
  circle.style.top = `${yInside}px`
  circle.style.left = `${xInside}px`

  e.target.appendChild(circle)

  setTimeout(() => circle.remove(), 350)
}

const storeConverterDataLocally = (converter, numberInput) => {
  if (!localStorage) return

  const converterData = {
    topActiveUnit: converter.topActiveUnit,
    bottomActiveUnit: converter.bottomActiveUnit,
    topUnit: numberInput.topUnit || "",
    bottomUnit: numberInput.bottomUnit || "",
    topUnitValue: converter.topUnitValue || "",
    bottomUnitValue: converter.bottomUnitValue || "",
    activeDropdown: converter.activeDropdown
  }

  if (converter.name !== "bmiData") {
    converterData.hasConvertedToTopEquiv = converter.hasConvertedToTopEquiv
    converterData.hasConvertedToBottomEquiv =
      converter.hasConvertedToBottomEquiv
  }

  localStorage.setItem(converter.name, JSON.stringify(converterData))
}

const getStoredConverterData = (converter, numberInput) => {
  const storedData = JSON.parse(localStorage.getItem(converter.name))

  if (storedData) {
    converter.activeDropdown = storedData.activeDropdown
    converter.topActiveUnit = storedData.topActiveUnit
    converter.bottomActiveUnit = storedData.bottomActiveUnit

    if (converter.activeDropdown === "top") {
      numberInput.topUnit = storedData.topUnit
      converter.topUnitValue = storedData.topUnitValue

      if (converter.name === "bmiData") {
        numberInput.bottomUnit = storedData.bottomUnit
        converter.bottomUnitValue = storedData.bottomUnitValue
      } else {
        converter.hasConvertedToTopEquiv = true
      }
    }

    if (converter.activeDropdown === "bottom") {
      numberInput.bottomUnit = storedData.bottomUnit
      converter.bottomUnitValue = storedData.bottomUnitValue

      if (converter.name === "bmiData") {
        numberInput.topUnit = storedData.topUnit
        converter.topUnitValue = storedData.topUnitValue
      } else {
        converter.hasConvertedToBottomEquiv = true
      }
    }
  }
}

const convertTopUnitToBottomEquiv = (converter, unitValue, convertValues) => {
  if (!unitValue) return

  // convert the string number to a number
  let topUnitValue = removeCommas(unitValue)

  let dropdown = "top"
  let convertedValue = convertValues(dropdown, topUnitValue)

  // if negating the top unit value in the Temperature Converter results
  // in a value of '-0' for the bottom unit, remove the hyphen
  convertedValue =
    convertedValue === "-0" ? convertedValue.slice(1) : convertedValue

  return !isNaN(parseFloat(convertedValue))
    ? convertedValue
    : converter.defaultResult
}

const convertBottomUnitToTopEquiv = (converter, unitValue, convertValues) => {
  if (!unitValue) return

  // convert the string number to a number
  let bottomUnitValue = removeCommas(unitValue)

  let dropdown = "bottom"
  let convertedValue = convertValues(dropdown, bottomUnitValue)

  // if negating the bottom unit value in the Temperature Converter results
  // in a value of '-0' for the top unit, remove the hyphen
  convertedValue =
    convertedValue === "-0" ? convertedValue.slice(1) : convertedValue

  return !isNaN(parseFloat(convertedValue))
    ? convertedValue
    : converter.defaultResult
}

const convertResultToExponential = (converter) => {
  // return if converting a unit's value to the same unit
  if (
    converter.bottomUnitName === converter.topUnitName &&
    converter.bottomUnitValue === converter.topUnitValue
  )
    return

  let number

  if (converter.activeDropdown === "top") {
    number = converter.bottomUnitValue
  } else {
    number = converter.topUnitValue
  }

  if (!number) return

  const numWithoutCommas = removeCommas(number)
  const stringNumber = numWithoutCommas.toString()
  const integerPortion = stringNumber.split(".")[0]

  // check if the number starts with a zero followed by a decimal point and four or more zeros
  if (number.includes(".")) {
    const regex = /^0\.0{4,}/

    if (regex.test(number)) {
      if (converter.activeDropdown === "top") {
        converter.bottomUnitValue = numWithoutCommas.toExponential()
      } else {
        converter.topUnitValue = numWithoutCommas.toExponential()
      }
    }
  }

  // check if the integer portion of the number is greater than a billion
  if (integerPortion.length > 9) {
    const largeNumber = parseFloat(numWithoutCommas.toFixed(0))

    if (converter.activeDropdown === "top") {
      converter.bottomUnitValue = largeNumber.toExponential()
    } else {
      converter.topUnitValue = largeNumber.toExponential()
    }
  }
}

const setNumberOfFractionDigits = (number) => {
  // set the number of fraction digits to show based on how large or small
  // the interger portion of the number is
  let convertedValue
  const stringNumber = number.toString()
  const integerPortion = stringNumber.split(".")[0]

  // check if the number is in decimal or exponential (e) notation
  if (stringNumber.includes(".") || stringNumber.includes("e")) {
    if (integerPortion.length > 7) {
      convertedValue = number.toLocaleString("en", {
        maximumFractionDigits: 2
      })
    } else {
      convertedValue = number.toLocaleString("en", {
        maximumFractionDigits: 12
      })
    }
  } else {
    convertedValue = number.toLocaleString("en")
  }

  return convertedValue
}

provide("appendNumber", appendNumber)
provide("removeCommas", removeCommas)
provide("clearAll", clearAll)
provide("clearChars", clearChars)
provide("listenForKeyboardInputs", listenForKeyboardInputs)
provide("removeListenerForKeyboardInputs", removeListenerForKeyboardInputs)
provide("showRippleEffectOnButtons", showRippleEffectOnButtons)
provide("storeConverterDataLocally", storeConverterDataLocally)
provide("getStoredConverterData", getStoredConverterData)
provide("convertTopUnitToBottomEquiv", convertTopUnitToBottomEquiv)
provide("convertBottomUnitToTopEquiv", convertBottomUnitToTopEquiv)
provide("convertResultToExponential", convertResultToExponential)
provide("setNumberOfFractionDigits", setNumberOfFractionDigits)
</script>
