<template>
  <div class="component-wrapper">
    <!-- The Output -->
    <div class="display-container math-calculator">
      <!-- Blurred Left & Right Edges For Previous Operations -->
      <div class="absolute top-4 left-4 w-5 h-8 bg-liver blur-md z-10"></div>
      <div class="absolute top-4 right-0 w-5 h-8 bg-liver blur-lg z-10"></div>

      <!-- Background Text -->
      <div class="bg-text math-calculator">
        <span>{{ $route.name }}</span>
      </div>

      <!-- Previous Operations -->
      <!-- use the transition-group component to animate the expressions being added to the history -->
      <div class="expressions-history-wrapper z-20" ref="historyRef">
        <transition-group tag="div" name="expressions">
          <span
            class="inline-block mb-1 md:mb-0 md:ml-4 text-lg"
            v-for="expression in mathData.history"
            :key="expression"
          >
            <span class="block md:inline-block leading-snug"
              >{{ expression.prevOperand }}{{ expression.operator
              }}{{ expression.currOperand }}</span
            >
            <span class="relative -top-1 md:top-0">
              = {{ expression.result }}</span
            >
          </span>
        </transition-group>
      </div>

      <!-- Current Expression -->
      <div class="expression-wrapper">
        <div v-if="mathData.expression">
          <!-- Current Operand -->
          <h2
            class="text-navajo-white duration-200"
            :class="[
              mathData.hasEvaluated
                ? 'text-2xl md:text-[26px]'
                : 'text-3xl md:text-[40px]'
            ]"
          >
            {{ mathData.expression }}
          </h2>

          <!-- Result -->
          <h3
            class="md:mt-1 duration-200"
            :class="[
              mathData.hasEvaluated
                ? 'text-3xl sm:text-4xl md:text-[40px] text-navajo-white'
                : 'text-2xl md:text-[26px]'
            ]"
          >
            = {{ mathData.result }}
          </h3>
        </div>
        <div v-else>
          <!-- Default Result -->
          <h2 class="text-4xl md:text-[40px] text-navajo-white">
            {{ mathData.defaultResult }}
          </h2>
        </div>
      </div>
    </div>

    <!-- The Buttons -->
    <div ref="buttonsContainerRef" class="buttons-container math-calculator">
      <ConverterButtons
        mode="math"
        @appendNumber="appendNumber"
        @clear="clear"
        @backspace="backspace"
        @setOperation="setOperation"
        @evaluateExpression="evaluateExpression"
      />
    </div>
  </div>
</template>

<script setup>
import ConverterButtons from "@/components/ui/ConverterButtons.vue"
import {
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  reactive,
  ref,
  watch,
  inject
} from "vue"
import { useRoute } from "vue-router"

// create a route object by calling useRoute
const route = useRoute()

const showRippleEffectOnButtons = inject("showRippleEffectOnButtons")
const setNumberOfFractionDigits = inject("setNumberOfFractionDigits")
const adjustCalculatorHeight = inject("adjustCalculatorHeight")

// number input on the calc display
const numberInput = ref("")

// reactive data object for related math data
const mathData = reactive({
  expression: null,
  currentOperand: "",
  previousOperand: "",
  operation: "",
  result: "",
  hasEvaluated: false,
  defaultResult: 0,
  history: null
})

// keep track of the length of the expression on screen
const expressionLength = ref(null)

// convert the template ref into a data ref
const historyRef = ref(null)
const buttonsContainerRef = ref(null)

// watch the history array, and scroll newly added elements into view
watch(
  () => mathData.history,
  (newExpression) => {
    if (newExpression) {
      // watch the length of the history array
      watch(
        () => mathData.history?.length,
        (newLength) => {
          if (newLength) {
            let lastPosition = newLength - 1

            // scroll the last <span> element into view
            historyRef.value.children[0].children[lastPosition].scrollIntoView()
          }
        }
      )
    }
  }
)

// watcher to keep track of the length of the expression
watch(
  () => mathData.expression,
  (newExp) => {
    if (newExp) {
      expressionLength.value = newExp.length
    }
  }
)

// retrieve any locally stored math data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredMathData()
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  showRippleEffectOnButtons(buttonsContainerRef)
  listenForKeyboardInputs()

  window.addEventListener("resize", adjustCalculatorHeight)
  adjustCalculatorHeight()
})

onBeforeUnmount(() => {
  removeListenerForKeyboardInputs()
  window.removeEventListener("resize", adjustCalculatorHeight)
})

/*
  Methods
*/
const appendNumber = (number) => {
  if (route.name !== "math") return
  if (checkNumberLength(mathData.currentOperand)) return

  // if the expression has been evaluated, store the expression and clear the screen
  if (mathData.hasEvaluated) {
    storeExpression()
    clear()
  }
  mathData.hasEvaluated = false

  // reset the numberInput ref
  if (mathData.previousOperand !== "" && mathData.currentOperand === "")
    numberInput.value = ""

  // return if zero is clicked and there are no previous and current operands
  if (number === 0 && !mathData.currentOperand && !mathData.previousOperand)
    return

  // if the number already contains a decimal point return
  if (number === "." && numberInput.value.includes(".")) return

  // convert the number to a string
  let stringNumber = number.toString()
  numberInput.value += stringNumber

  // get the Integer and Decimal parts of a number e.g 3.142
  let integerNumbers = removeCommas(numberInput.value.split(".")[0]) // integer = 3
  let decimalNumbers = numberInput.value.split(".")[1] // decimal = 142
  let integerPortion

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
    numberInput.value = "0."
    integerPortion = "0"
    mathData.result = integerPortion
  }

  // handle displaying any decimal digits
  if (decimalNumbers != null) {
    mathData.currentOperand = `${integerPortion}.${decimalNumbers}`

    // Don't show the decimal part if it's only zeros after the point i.e 3.0 or 3.0000 just equals 3
    if (decimalNumbers.length > 0 && parseFloat(decimalNumbers) === 0) {
      mathData.result = integerPortion
    } else if (decimalNumbers.length > 0) {
      mathData.result = `${integerPortion}.${decimalNumbers}`
      mathData.result = setNumberOfFractionDigits(removeCommas(mathData.result))
    }
  } else {
    mathData.currentOperand = integerPortion
    mathData.result = integerPortion
  }

  updateDisplay()
}

const checkNumberLength = (number) => {
  // limit the size of the number that a user can input
  const MAX_INTEGER_LENGTH = 15
  const MAX_FLOAT_LENGTH = 18

  let numToCheck

  if (number.includes(",")) {
    numToCheck = removeCommas(number).toString()
  } else {
    numToCheck = number
  }

  if (numToCheck.includes(".")) {
    if (numToCheck.length + 1 > MAX_FLOAT_LENGTH) return true
  } else {
    if (numToCheck.length + 1 > MAX_INTEGER_LENGTH) return true
  }
  return false
}

const setOperation = (operation) => {
  // if the expression has been evaluated, store the expression
  if (mathData.hasEvaluated) storeExpression()
  mathData.hasEvaluated = false

  // allow the user to change an operation once it has been set e.g. if the
  // expression is something like 5x, pressing any other operator (+) will
  // only update the operator resulting in 5+
  if (mathData.previousOperand && mathData.currentOperand === "") {
    mathData.operation = operation
    updateDisplay()
    return
  }

  // reset values
  mathData.previousOperand = ""
  numberInput.value = ""

  // if an operator is clicked and there is no previous operand or current operand
  if (mathData.currentOperand === "" && mathData.previousOperand === "")
    mathData.currentOperand = "0"

  if (mathData.currentOperand === "") return

  if (mathData.previousOperand !== "") compute()

  mathData.operation = operation
  mathData.previousOperand = mathData.currentOperand
  mathData.currentOperand = ""

  updateDisplay()
}

const updateDisplay = () => {
  if (
    mathData.previousOperand &&
    mathData.operation &&
    mathData.currentOperand
  ) {
    // add a space before the operation to break the expression if it gets too long
    if (expressionLength.value >= 22) {
      mathData.expression = `${mathData.previousOperand} ${mathData.operation}${mathData.currentOperand}`
    } else {
      mathData.expression = `${mathData.previousOperand}${mathData.operation}${mathData.currentOperand}`
    }
  } else if (mathData.previousOperand && mathData.operation) {
    mathData.expression = `${mathData.previousOperand}${mathData.operation}`
  } else if (mathData.currentOperand) {
    mathData.expression = mathData.currentOperand
  }

  compute()
  storeMathDataLocally()
}

const compute = () => {
  let result
  let prev = removeCommas(mathData.previousOperand)
  let current = removeCommas(mathData.currentOperand)

  if (prev === 0 && isNaN(current)) {
    current = 0
  }

  if (isNaN(prev) || isNaN(current)) {
    convertResultToExponential(mathData.result)
    return
  }

  switch (mathData.operation) {
    case "+":
      result = prev + current
      break
    case "-":
      result = prev - current
      break
    case "×":
      result = prev * current
      break
    case "÷":
      result = prev / current
      if (isNaN(result)) result = 0
      break
    default:
      return
  }

  // handle the case of dividing by a number by zero
  if (result === Infinity) {
    mathData.result = "Can't divide by zero"
    return
  }

  mathData.result = setNumberOfFractionDigits(result)
  mathData.currentOperand = mathData.result
  convertResultToExponential(mathData.result)
}

const convertResultToExponential = (number) => {
  const numWithoutCommas = removeCommas(number)
  const stringNumber = numWithoutCommas.toString()
  const integerPortion = stringNumber.split(".")[0]

  // check if the number is zero and if there is no ongoing operation
  if (numWithoutCommas === 0 && mathData.operation === "") {
    mathData.result = numWithoutCommas
    return
  }

  // check if the number starts with a zero followed by a decimal point and four or more zeros
  if (number.includes(".")) {
    const regex = /^0\.0{4,}/

    if (regex.test(number)) {
      mathData.result = numWithoutCommas.toExponential()
    }
  }

  // check if the number integer portion of the number is greater than a billion
  if (integerPortion.length > 9) {
    mathData.result = numWithoutCommas.toExponential(8)
  }
}

const evaluateExpression = () => {
  mathData.hasEvaluated = true
  storeMathDataLocally()
}

const storeExpression = () => {
  if (!mathData.expression) return
  const newExpression = parseExpression(mathData.expression)
  newExpression.result = mathData.result

  // if the history array has existing elements, add more to it
  if (mathData.history && mathData.history[0]) {
    mathData.history.push(newExpression)
    return
  }

  // otherwise create the history array and add the first item
  mathData.history = new Array(newExpression)
}

const parseExpression = (expression) => {
  // the operators and their corresponding regex
  const operators = [
    { symbol: "+", regex: /\+/ },
    { symbol: "-", regex: /-/ },
    { symbol: "÷", regex: /÷/ },
    { symbol: "×", regex: /×/ }
  ]

  // iterate through each operator to check and split the expression
  for (let operator of operators) {
    if (expression.includes(operator.symbol)) {
      // split the expression by the operator
      const operands = expression.split(operator.regex)
      const prevOperand = operands[0]
      const currOperand = operands[1]

      return {
        prevOperand: prevOperand,
        operator: operator.symbol,
        currOperand: currOperand
      }
    }
  }
}

const storeMathDataLocally = () => {
  if (!localStorage) return

  localStorage.setItem(
    "mathData",
    JSON.stringify({
      numberInput: numberInput.value ?? "",
      expression: mathData.expression ?? null,
      currentOperand: mathData.currentOperand ?? "",
      previousOperand: mathData.previousOperand ?? "",
      operation: mathData.operation ?? "",
      result: mathData.result ?? "",
      hasEvaluated: mathData.hasEvaluated ?? false,
      history: mathData.history ?? null
    })
  )
}

const getStoredMathData = () => {
  const storedMathData = JSON.parse(localStorage.getItem("mathData"))

  if (storedMathData) {
    numberInput.value = storedMathData.numberInput
    mathData.expression = storedMathData.expression
    mathData.currentOperand = storedMathData.currentOperand
    mathData.previousOperand = storedMathData.previousOperand
    mathData.operation = storedMathData.operation
    mathData.result = storedMathData.result
    mathData.hasEvaluated = storedMathData.hasEvaluated
    mathData.history = storedMathData.history
  }
}

const clear = (type) => {
  numberInput.value = ""
  mathData.currentOperand = ""
  mathData.result = ""
  mathData.previousOperand = ""
  mathData.operation = ""
  mathData.expression = null
  mathData.hasEvaluated = false

  if (type === "all") mathData.history = null

  storeMathDataLocally()
}

const backspace = () => {
  if (mathData.hasEvaluated) return
  if (mathData.expression == null) return
  if (mathData.expression === "0.") {
    clear()
    return
  }

  // remove the last character from the expression shown on the calc display
  mathData.expression = mathData.expression.slice(0, -1)

  if (mathData.expression === "") {
    clear()
    return
  }

  // if there is an operation, split the expression by it getting the previous and current operands
  if (
    mathData.operation !== "" &&
    mathData.expression.includes(mathData.operation)
  ) {
    let previous = mathData.expression.split(mathData.operation)[0]
    let current = mathData.expression.split(mathData.operation)[1]
      ? mathData.expression.split(mathData.operation)[1]
      : ""

    mathData.previousOperand = previous
    mathData.currentOperand = current
    numberInput.value = mathData.currentOperand

    // remove any comma seperators from the current operand
    if (mathData.currentOperand.includes(",")) {
      removeCommasFromCurrentOperand()
    }

    if (previous && current === "") mathData.result = previous

    updateDisplay()
    return
  }

  mathData.currentOperand = mathData.expression
  mathData.previousOperand = ""
  mathData.operation = ""

  // If only the current operand is available, update appropriate props
  if (mathData.currentOperand !== "") {
    numberInput.value = mathData.currentOperand
    mathData.result = mathData.currentOperand

    // if the currentOperand holds something like 3. the result should show 3 instead of 3.
    if (mathData.currentOperand.endsWith(".")) {
      mathData.result = mathData.currentOperand.slice(0, -1)
    }

    // remove any comma seperators from the current operand
    if (mathData.currentOperand.includes(",")) {
      removeCommasFromCurrentOperand()

      mathData.result = mathData.currentOperand

      if (mathData.currentOperand.endsWith(".")) {
        mathData.result = mathData.currentOperand.slice(0, -1)
      }

      mathData.result = setNumberOfFractionDigits(removeCommas(mathData.result))
    }
  }

  updateDisplay()
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

const removeCommasFromCurrentOperand = () => {
  let numWithoutCommas = removeCommas(mathData.currentOperand).toString()
  let numWithCommas = ""

  if (numWithoutCommas.includes(".")) {
    numWithCommas = parseFloat(numWithoutCommas).toLocaleString("en", {
      maximumFractionDigits: 7
    })
  } else {
    numWithCommas = parseFloat(numWithoutCommas).toLocaleString("en", {
      maximumFractionDigits: 0
    })
  }

  if (mathData.expression.endsWith(".") && !numWithCommas.includes("."))
    numWithCommas += "."

  mathData.currentOperand = numWithCommas
  numberInput.value = mathData.currentOperand
}

const handleKeyboardInputs = (e) => {
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
    "+",
    "-",
    "*",
    "/",
    "=",
    "Backspace",
    "Enter",
    "Delete"
  ]
  const keyPressed = e.key

  if (validKeys.includes(keyPressed)) {
    const operationKeys = ["+", "-", "*", "/"]

    if (operationKeys.includes(keyPressed)) {
      if (keyPressed === "*") {
        showRippleEffectOnButtons(buttonsContainerRef, "×")
        setOperation("×")
      } else if (keyPressed === "/") {
        showRippleEffectOnButtons(buttonsContainerRef, "÷")
        setOperation("÷")
      } else {
        showRippleEffectOnButtons(buttonsContainerRef, keyPressed)
        setOperation(keyPressed)
      }
    } else {
      if (keyPressed === "=" || keyPressed === "Enter") {
        showRippleEffectOnButtons(buttonsContainerRef, "=")
        evaluateExpression()
      } else if (keyPressed === "Backspace") {
        backspace()
      } else if (keyPressed === "Delete") {
        clear("all")
      } else {
        appendNumber(keyPressed)
      }

      showRippleEffectOnButtons(buttonsContainerRef, keyPressed)
    }
  }
}

const listenForKeyboardInputs = () => {
  window.addEventListener("keyup", (e) => handleKeyboardInputs(e))
}

const removeListenerForKeyboardInputs = () => {
  window.removeEventListener("keyup", (e) => handleKeyboardInputs(e))
}
</script>
