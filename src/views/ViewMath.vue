<template>
  <!-- The Output -->
  <div
    class="display-container md:min-h-[160px] overflow-x-hidden relative flex flex-col justify-end gap-2 p-5 bg-liver text-sandy-brown rounded-xl"
  >
    <!-- Blurred Left & Right Edges For Previous Operations -->
    <div class="absolute top-4 left-4 w-5 h-8 bg-liver blur-md z-10"></div>
    <div class="absolute top-4 right-0 w-5 h-8 bg-liver blur-lg z-10"></div>

    <!-- Background Text -->
    <div class="absolute top-5 md:top-1/2 md:-translate-y-1/2">
      <span class="text-pearl-copper text-4xl sm:text-5xl md:text-7xl">{{
        $route.name
      }}</span>
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
  <div
    ref="buttonsContainerRef"
    class="buttons-container md:min-h-full grid grid-cols-4 grid-rows-5 gap-2 text-2xl mt-3"
  >
    <!-- Row 1 Buttons -->
    <button @click="clear('all')" class="btn btn-clear">AC</button>
    <button @click="clear" class="btn btn-operators">C</button>
    <button @click="backspace" class="btn btn-operators">&laquo;</button>
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
    <button @click="appendNumber(0)" class="col-start-2 btn btn-numbers">
      0
    </button>
    <button @click="appendNumber('.')" class="btn btn-numbers">.</button>
    <button @click="evaluateExpression" class="btn btn-equals">=</button>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref, watch } from "vue"

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
        () => mathData.history.length,
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
  showRippleEffectOnButtonClick()
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
    switch (e.key) {
      case "0":
        showRippleEffectOnButtonClick("0")
        appendNumber(0)
        break
      case "1":
        showRippleEffectOnButtonClick("1")
        appendNumber(1)
        break
      case "2":
        showRippleEffectOnButtonClick("2")
        appendNumber(2)
        break
      case "3":
        showRippleEffectOnButtonClick("3")
        appendNumber(3)
        break
      case "4":
        showRippleEffectOnButtonClick("4")
        appendNumber(4)
        break
      case "5":
        showRippleEffectOnButtonClick("5")
        appendNumber(5)
        break
      case "6":
        showRippleEffectOnButtonClick("6")
        appendNumber(6)
        break
      case "7":
        showRippleEffectOnButtonClick("7")
        appendNumber(7)
        break
      case "8":
        showRippleEffectOnButtonClick("8")
        appendNumber(8)
        break
      case "9":
        showRippleEffectOnButtonClick("9")
        appendNumber(9)
        break
      case ".":
        showRippleEffectOnButtonClick(".")
        appendNumber(".")
        break
      case "+":
        showRippleEffectOnButtonClick("+")
        setOperation("+")
        break
      case "-":
        showRippleEffectOnButtonClick("-")
        setOperation("-")
        break
      case "*":
        showRippleEffectOnButtonClick("×")
        setOperation("×")
        break
      case "/":
        showRippleEffectOnButtonClick("÷")
        setOperation("÷")
        break
      case "Backspace":
        showRippleEffectOnButtonClick("Backspace")
        backspace()
        break
      case "Enter":
        showRippleEffectOnButtonClick("=")
        evaluateExpression()
        break
      case "=":
        showRippleEffectOnButtonClick("=")
        evaluateExpression()
        break
      default:
        return
    }
  })
}

const showRippleEffectOnButtonClick = (keyboardInput) => {
  const buttons = []

  for (let i = 0; i < buttonsContainerRef.value.children.length; i++) {
    buttons.push(buttonsContainerRef.value.children[i])
  }

  buttons.forEach((btn) => {
    // show ripple effects on buttons when input is from the keyboard
    if (keyboardInput === btn.innerText) {
      setRippleForKeyboardInputs(btn)
      return
    } else if (keyboardInput === "Backspace") {
      if (btn.innerText === "«") setRippleForKeyboardInputs(btn)
      return
    }

    btn.addEventListener("click", (e) => setRippleForClickedButton(e))
  })
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

  setTimeout(() => circle.remove(), 500)
}

const setRippleForKeyboardInputs = (btn) => {
  const rect = btn.getBoundingClientRect()

  // create a circle element to fill the button
  const circle = document.createElement("span")
  circle.classList.add("circle")
  circle.style.top = `50%`
  circle.style.left = `50%`

  btn.appendChild(circle)

  setTimeout(() => circle.remove(), 500)
}
</script>
