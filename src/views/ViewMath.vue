<template>
  <!-- The Output -->
  <div class="display-container math-calculator">
    <!-- Blurred Left & Right Edges For Previous Operations -->
    <div class="absolute top-4 left-4 w-5 h-8 bg-liver blur-md z-10"></div>
    <div class="absolute top-4 right-0 w-5 h-8 bg-liver blur-lg z-10"></div>

    <!-- Background Text -->
    <div class="bg-text">
      <span>{{ $route.name }}</span>
    </div>

    <!-- Previous Operations -->
    <!-- use the transition-group component to animate the expressions being added to the history -->
    <div class="expressions-wrapper z-20" ref="historyRef">
      <transition-group tag="div" name="expressions">
        <span
          class="inline-block mb-2 md:mb-0 md:ml-4 text-lg"
          v-for="expression in mathData.history"
          :key="expression"
        >
          {{ expression }}
        </span>
      </transition-group>
    </div>

    <!-- Current Expression -->
    <div class="text-right">
      <div v-if="mathData.expression">
        <!-- Current Operand -->
        <h2
          class="text-navajo-white duration-200"
          :class="[
            mathData.hasEvaluated
              ? 'text-2xl md:text-[26px]'
              : 'text-4xl md:text-[40px]'
          ]"
        >
          {{ mathData.expression }}
        </h2>

        <!-- Result -->
        <h3
          class="md:mt-1 duration-200"
          :class="[
            mathData.hasEvaluated
              ? 'text-4xl md:text-[40px] text-navajo-white'
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
</template>

<script setup>
import ConverterButtons from "@/components/ui/ConverterButtons.vue"
import { onBeforeMount, onMounted, reactive, ref, watch, inject } from "vue"

const showRippleEffectOnButtons = inject("showRippleEffectOnButtons")

// integer part of a float i.e 3.142 => 3
const integerPortion = ref("")

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

// retrieve any locally stored math data
onBeforeMount(() => {
  if (!localStorage) return
  getStoredMathData()
})

// set up a listener on the buttons once the component is mounted
onMounted(() => {
  showRippleEffectOnButtons(buttonsContainerRef)
  listenForKeyboardInputs()
})

/*
  Methods
*/
const appendNumber = (number) => {
  // if the expression has been evaluated, store the expression and clear the screen
  if (mathData.hasEvaluated) {
    storeExpression()
    clear()
  }
  mathData.hasEvaluated = false

  // reset the integerPortion ref
  if (mathData.previousOperand !== "" && mathData.currentOperand === "")
    integerPortion.value = ""

  // return if zero is clicked and there are no previous and current operands
  if (number === 0 && !mathData.currentOperand && !mathData.previousOperand)
    return

  // if the number already contains a decimal point return
  if (number === "." && integerPortion.value.includes(".")) return

  // convert the number to a string
  let stringNumber = number.toString()
  integerPortion.value += stringNumber

  // get the Integer and Decimal parts of a number e.g 3.142
  let integerNumbers = removeCommas(integerPortion.value.split(".")[0]) // integer = 3
  let decimalNumbers = integerPortion.value.split(".")[1] // decimal = 142
  let integerDisplay

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
  integerPortion.value = ""

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
    mathData.expression = `${mathData.previousOperand}${mathData.operation}${mathData.currentOperand}`
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

  if (isNaN(prev) || isNaN(current)) return

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

  // make the result comma separated with a max of 7 fraction digits
  mathData.result = result.toLocaleString("en", {
    maximumFractionDigits: 7
  })

  mathData.currentOperand = mathData.result
}

const evaluateExpression = () => {
  mathData.hasEvaluated = true
  storeMathDataLocally()
}

const storeExpression = () => {
  if (!mathData.expression) return

  let fullExpression = `${mathData.expression} = ${mathData.result}`

  // if the history array has existing elements, add more to it
  if (mathData.history && mathData.history[0]) {
    mathData.history.push(fullExpression)
    return
  }

  // otherwise create the history array and add the first item
  mathData.history = new Array(fullExpression)
}

const storeMathDataLocally = () => {
  if (!localStorage) return

  localStorage.setItem(
    "mathData",
    JSON.stringify({
      integerPortion: integerPortion.value ?? "",
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
    integerPortion.value = storedMathData.integerPortion
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
  integerPortion.value = ""
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
    integerPortion.value = mathData.currentOperand

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
    integerPortion.value = mathData.currentOperand
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
  integerPortion.value = mathData.currentOperand
}

const listenForKeyboardInputs = () => {
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
      ".",
      "+",
      "-",
      "*",
      "/",
      "=",
      "Backspace",
      "Enter"
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
        } else {
          appendNumber(keyPressed)
        }

        showRippleEffectOnButtons(buttonsContainerRef, keyPressed)
      }
    }
  })
}
</script>
