<template>
  <!-- Calculator Container -->
  <div
    class="relative max-w-3xl mx-auto h-screen md:h-auto md:mt-3 p-4 bg-navajo-white shadow-xl rounded-xl"
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
const appendNumber = (number, activeDropdown, converter, integerPortion) => {
  // the hasConvertedTo... flag prevents the watcher methods for topUnitValue
  // and bottomUnitValue from running twice inside child components
  if (activeDropdown.value === "top") {
    converter.hasConvertedToTopEquiv = true
    converter.hasBottomUnitChanged = false
  } else if (activeDropdown.value === "bottom") {
    converter.hasConvertedToBottomEquiv = true
    converter.hasTopUnitChanged = false
  }

  // reset the flag that checks if the active dropdown has changed
  converter.hasSwitchedActiveDropdown = false

  // return if zero is clicked when either the top or bottom unit values are zero
  // and if the number already contains a decimal point return
  if (activeDropdown.value === "top") {
    if (number === 0 && !converter.topUnitValue) return
    if (number === "." && integerPortion.topUnit.includes(".")) return
  } else {
    if (number === 0 && !converter.bottomUnitValue) return
    if (number === "." && integerPortion.bottomUnit.includes(".")) return
  }

  // convert the number to a string
  let stringNumber = number.toString()
  if (activeDropdown.value === "top") {
    integerPortion.topUnit += stringNumber
  } else {
    integerPortion.bottomUnit += stringNumber
  }

  // get the Integer and Decimal parts of a number e.g 3.142
  let integerNumbers
  let decimalNumbers
  let integerDisplay

  if (activeDropdown.value === "top") {
    integerNumbers = removeCommas(integerPortion.topUnit.split(".")[0]) // integer = 3
    decimalNumbers = integerPortion.topUnit.split(".")[1] // decimal = 142
  } else {
    integerNumbers = removeCommas(integerPortion.bottomUnit.split(".")[0])
    decimalNumbers = integerPortion.bottomUnit.split(".")[1]
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
      integerPortion.topUnit = "0."
      integerDisplay = "0"
    } else {
      integerPortion.bottomUnit = "0."
      integerDisplay = "0"
    }
  }

  // handle displaying any decimal digits
  if (decimalNumbers != null) {
    if (activeDropdown.value === "top") {
      converter.topUnitValue = `${integerDisplay}.${decimalNumbers}`
    } else {
      converter.bottomUnitValue = `${integerDisplay}.${decimalNumbers}`
    }
  } else {
    if (activeDropdown.value === "top") {
      converter.topUnitValue = integerDisplay
    } else {
      converter.bottomUnitValue = integerDisplay
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

const clearAll = (converter, integerPortion) => {
  integerPortion.topUnit = ""
  integerPortion.bottomUnit = ""
  converter.topUnitValue = ""
  converter.bottomUnitValue = ""

  // TODO storeMathDataLocally()
}

const clearChars = (activeDropdown, converter, integerPortion) => {
  // remove the last character from the expression shown on the calc display
  //
  // the hasConvertedTo... flag prevents the watcher methods above
  // for topUnitValue and bottomUnitValue from running twice
  if (activeDropdown.value === "top") {
    converter.topUnitValue = converter.topUnitValue.slice(0, -1)
    integerPortion.topUnit = converter.topUnitValue
    converter.hasConvertedToTopEquiv = true
  } else {
    converter.bottomUnitValue = converter.bottomUnitValue.slice(0, -1)
    integerPortion.bottomUnit = converter.bottomUnitValue
    converter.hasConvertedToBottomEquiv = true
  }

  // remove any comma seperators and handle deleting chars from numbers with decimals
  if (
    converter.topUnitValue.includes(",") ||
    converter.bottomUnitValue.includes(",")
  ) {
    removeCommasFromUnitValues(activeDropdown, converter, integerPortion)
  }
}

const removeCommasFromUnitValues = (
  activeDropdown,
  converter,
  integerPortion
) => {
  let numWithoutCommas,
    numWithCommas = ""

  if (activeDropdown.value === "top") {
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

  if (activeDropdown.value === "top") {
    if (converter.topUnitValue.endsWith(".") && !numWithCommas.includes("."))
      numWithCommas += "."

    converter.topUnitValue = numWithCommas
    integerPortion.topUnit = converter.topUnitValue
  } else {
    if (converter.bottomUnitValue.endsWith(".") && !numWithCommas.includes("."))
      numWithCommas += "."

    converter.bottomUnitValue = numWithCommas
    integerPortion.bottomUnit = converter.bottomUnitValue
  }
}

const listenForKeyboardInputs = (
  activeDropdown,
  converter,
  integerPortion,
  buttonsRef
) => {
  window.addEventListener("keyup", (e) => {
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
      "Backspace"
    ]
    const keyPressed = e.key

    if (validKeys.includes(keyPressed)) {
      showRippleEffectOnButtons(buttonsRef, keyPressed)

      // check if the key pressed is not a number. In this case, 'Backspace'
      if (isNaN(+keyPressed)) {
        clearChars(activeDropdown, converter, integerPortion)
        return
      }

      appendNumber(keyPressed, activeDropdown, converter, integerPortion)
    }
  })
}

const showRippleEffectOnButtons = (buttonsRef, keyboardInput) => {
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

provide("appendNumber", appendNumber)
provide("removeCommas", removeCommas)
provide("clearAll", clearAll)
provide("clearChars", clearChars)
provide("listenForKeyboardInputs", listenForKeyboardInputs)
provide("showRippleEffectOnButtons", showRippleEffectOnButtons)
</script>
