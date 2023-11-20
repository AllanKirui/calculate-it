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
  if (activeDropdown.value === "top") {
    converter.topUnitValue = converter.topUnitValue.slice(0, -1)
    integerPortion.topUnit = converter.topUnitValue
  } else {
    converter.bottomUnitValue = converter.bottomUnitValue.slice(0, -1)
    integerPortion.bottomUnit = converter.bottomUnitValue
  }

  // remove any comma seperators and handle deleting chars from numbers with decimals
  if (converter.topUnitValue.includes(",")) {
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

provide("removeCommas", removeCommas)
provide("clearAll", clearAll)
provide("clearChars", clearChars)
</script>
