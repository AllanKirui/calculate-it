<template>
  <!-- The Output -->
  <div
    class="overflow-x-hidden relative flex flex-col justify-end gap-2 min-h-[150px] p-5 bg-liver text-sandy-brown rounded-xl">
    <!-- Blurred Left & Right Edges For Previous Operations -->
    <div class="absolute top-4 left-4 w-5 h-8 bg-liver blur-md z-10"></div>
    <div class="absolute top-4 right-0 w-5 h-8 bg-liver blur-lg z-10"></div>

    <!-- Previous Operations -->
    <div v-if="mathData.history" class="horizontally-scrollable pb-1 text-right whitespace-nowrap overflow-x-auto">
      <span class="ml-5">6 x 7 = 42</span>
    </div>

    <!-- Current Expression -->
    <div class="text-right">
      <div v-if="mathData.expression">
        <!-- Current Operand -->
        <h2 class="text-3xl md:text-[40px] text-navajo-white">{{ mathData.expression }}</h2>

        <!-- Result -->
        <h3 class="mt-1 text-2xl md:text-[26px]">= {{ mathData.result }}</h3>
      </div>
      <div v-else>
        <!-- Default Result -->
        <h2 class="text-3xl md:text-[40px] text-navajo-white">{{ mathData.defaultResult }}</h2>
      </div>
    </div>
  </div>

  <!-- The Buttons -->
  <div class="grid grid-cols-4 grid-rows-4 gap-2 text-2xl mt-3">
    <!-- Row 1 Buttons -->
    <button @click="clear" class="btn btn-clear">AC</button>
    <button class="btn btn-operators">C</button>
    <button class="btn btn-operators">%</button>
    <button @click="setOperation('÷')" class="btn btn-operators">÷</button>

    <!-- Row 2 Buttons -->
    <button @click="appendNumber(7)" class="btn btn-numbers">7</button>
    <button @click="appendNumber(8)" class="btn btn-numbers">8</button>
    <button @click="appendNumber(9)" class="btn btn-numbers">9</button>
    <button @click="setOperation('×')" class="btn btn-operators">×</button>

    <!-- Row 3 Buttons -->
    <button @click="appendNumber(4)" class="btn btn-numbers">4</button>
    <button @click="appendNumber(5)" class="btn btn-numbers">5</button>
    <button @click="appendNumber(6)" class="btn btn-numbers">6</button>
    <button @click="setOperation('-')" class="btn btn-operators">-</button>

    <!-- Row 4 Buttons -->
    <button @click="appendNumber(1)" class="btn btn-numbers">1</button>
    <button @click="appendNumber(2)" class="btn btn-numbers">2</button>
    <button @click="appendNumber(3)" class="btn btn-numbers">3</button>
    <button @click="setOperation('+')" class="btn btn-operators">+</button>

    <!-- Row 5 Buttons -->
    <button @click="appendNumber(0)" class="col-start-2 btn btn-numbers">0</button>
    <button @click="appendNumber('.')" class="btn btn-numbers">.</button>
    <button class="btn btn-equals">=</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

// integer part of a float i.e 3.142 => 3
const integerPortion = ref("")

// reactive data object for related math data
const mathData = reactive({
  expression: null,
  currentOperand: "",
  previousOperand: "",
  operation: "",
  result: "",
  defaultResult: 0,
  history: null,
})

/* 
  Methods
*/
const appendNumber = (number) => {
  // reset the integerPortion ref
  if (mathData.previousOperand !== "" && mathData.currentOperand === "") integerPortion.value = ""

  // return if zero is clicked and there is no previous operand or current operand
  if (number === 0 && mathData.currentOperand === "" && mathData.previousOperand === "") return

  // if the number already contains a decimal point return
  if (number === "." && mathData.currentOperand.includes(".")) return

  // convert the number to a string 
  let stringNumber = number.toString()
  integerPortion.value += stringNumber

  // get the Integer and Decimal parts of a number e.g 3.142
  let integerNumbers = parseFloat(integerPortion.value.split(".")[0]) // integer = 3
  let decimalNumbers = integerPortion.value.split(".")[1] // decimal = 142
  let integerDisplay

  // check if integerNumbers holds an actual number and convert that to a string
  if (isNaN(integerNumbers)) {
    integerDisplay = ""
  } else {
    integerDisplay = integerNumbers.toLocaleString("en", {
      maximumFractionDigits: 0,
    })
  }

  // if the decimal point is the first button to be clicked add a zero before it
  if (number === "." && isNaN(integerNumbers)) {
    integerPortion.value = "0."
    integerDisplay = "0"
    mathData.result = integerDisplay
  }

  // handle displaying any decimal digits
  if (decimalNumbers != null) {
    mathData.currentOperand = `${integerDisplay}.${decimalNumbers}`

    // Don't show the decimal part if it's only zeros after the point i.e 3.0 or 3.0000 just equals 3
    if (decimalNumbers.length > 0 && parseFloat(decimalNumbers) === 0) {
      mathData.result = integerDisplay
    } else if (decimalNumbers.length > 0) {
      mathData.result = `${integerDisplay}.${decimalNumbers}`
    }
  } else {
    mathData.currentOperand = integerDisplay
    mathData.result = integerDisplay
  }

  updateDisplay()
}

const setOperation = (operation) => {
  mathData.previousOperand = ""

  if (mathData.currentOperand === "") return;

  if (mathData.previousOperand !== "") {
    compute()
  }

  mathData.operation = operation
  mathData.previousOperand = mathData.currentOperand
  mathData.currentOperand = ""

  updateDisplay()
}

const updateDisplay = () => {
  if (mathData.previousOperand && mathData.operation && mathData.currentOperand) {
    mathData.expression = `${mathData.previousOperand}${mathData.operation}${mathData.currentOperand}`
  } else if (mathData.previousOperand && mathData.operation) {
    mathData.expression = `${mathData.previousOperand}${mathData.operation}`
  } else if (mathData.currentOperand) {
    mathData.expression = mathData.currentOperand
  }

  compute()
}

const compute = () => {
  let result
  const prev = removeCommas(mathData.previousOperand)
  const current = removeCommas(mathData.currentOperand)

  if (isNaN(prev) || isNaN(current)) return

  switch (mathData.operation) {
    case "+":
      result = prev + current
      break;
    case "-":
      result = prev - current
      break;
    case "×":
      result = prev * current
      break;
    case "÷":
      result = prev / current
      break;
    default:
      return;
  }

  // make the result comma separated with a max of 7 fraction digits
  mathData.result = result.toLocaleString("en", {
    maximumFractionDigits: 7,
  })

  mathData.currentOperand = mathData.result
}

const clear = () => {
  mathData.currentOperand = ""
  mathData.result = ""
  integerPortion.value = ""
}

const removeCommas = (stringNumber) => {
  if (!stringNumber.includes(',')) {
    return parseFloat(stringNumber)
  }

  let num = ""
  let stringArr = stringNumber.split(",")

  stringArr.forEach((string) => num += string)

  return parseFloat(num)
}
</script>