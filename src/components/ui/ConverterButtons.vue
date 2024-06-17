<template>
  <!-- Row 1 Buttons for Math Calculator -->
  <template v-if="mode === 'math'">
    <button @click="handleClick('clear', 'all', $event)" class="btn btn-clear">
      AC
    </button>
    <button
      @click="handleClick('clear', null, $event)"
      class="btn btn-operators"
    >
      C
    </button>
    <button
      @click="handleClick('backspace', null, $event)"
      class="btn btn-operators has-image"
    >
      <img
        src="@/assets/img/delete.svg"
        width="28"
        height="28"
        alt="delete icon"
      />
    </button>
    <button
      @click="handleClick('setOperation', '÷', $event)"
      class="btn btn-operators"
    >
      ÷
    </button>
  </template>

  <!-- Row 2 Buttons -->
  <button
    @click="handleClick('appendNumber', 7, $event)"
    class="btn btn-numbers"
  >
    7
  </button>
  <button
    @click="handleClick('appendNumber', 8, $event)"
    class="btn btn-numbers"
  >
    8
  </button>
  <button
    @click="handleClick('appendNumber', 9, $event)"
    class="btn btn-numbers"
  >
    9
  </button>
  <button
    v-if="mode == 'math'"
    @click="handleClick('setOperation', '×', $event)"
    class="btn btn-operators"
  >
    ×
  </button>
  <button
    v-else-if="mode == 'temp' || mode == 'bmi'"
    @click="handleClick('clear', null, $event)"
    class="btn btn-clear row-span-1"
  >
    AC
  </button>
  <button
    v-else
    @click="handleClick('clear', null, $event)"
    class="btn btn-clear row-span-2"
  >
    AC
  </button>

  <!-- Row 3 Buttons -->
  <button
    @click="handleClick('appendNumber', 4, $event)"
    class="btn btn-numbers"
  >
    4
  </button>
  <button
    @click="handleClick('appendNumber', 5, $event)"
    class="btn btn-numbers"
  >
    5
  </button>
  <button
    @click="handleClick('appendNumber', 6, $event)"
    class="btn btn-numbers"
  >
    6
  </button>
  <button
    v-if="mode === 'math'"
    @click="handleClick('setOperation', '-', $event)"
    class="btn btn-operators"
  >
    -
  </button>
  <button
    v-else-if="mode === 'temp' || mode === 'bmi'"
    @click="handleClick('backspace', null, $event)"
    class="btn btn-operators row-span-1 has-image"
  >
    <img
      src="@/assets/img/delete.svg"
      width="28"
      height="28"
      alt="delete icon"
    />
  </button>

  <!-- Row 4 Buttons -->
  <button
    @click="handleClick('appendNumber', 1, $event)"
    class="btn btn-numbers"
  >
    1
  </button>
  <button
    @click="handleClick('appendNumber', 2, $event)"
    class="btn btn-numbers"
  >
    2
  </button>
  <button
    @click="handleClick('appendNumber', 3, $event)"
    class="btn btn-numbers"
  >
    3
  </button>
  <button
    v-if="mode == 'math'"
    @click="handleClick('setOperation', '+', $event)"
    class="btn btn-operators"
  >
    +
  </button>
  <button
    v-else-if="mode == 'temp'"
    @click="handleClick('toggleNegativeValue', null, $event)"
    class="btn btn-operators row-span-1"
  >
    +/-
  </button>
  <button
    v-else-if="mode == 'bmi'"
    @click="handleClick('calculateBMI', null, $event)"
    class="btn btn-equals row-span-2"
  >
    GO
  </button>
  <button
    v-else
    @click="handleClick('backspace', null, $event)"
    class="btn btn-operators row-span-2 has-image"
  >
    <img
      src="@/assets/img/delete.svg"
      width="28"
      height="28"
      alt="delete icon"
    />
  </button>

  <!-- Row 5 Buttons -->
  <button
    @click="handleClick('appendNumber', 0, $event)"
    class="col-start-2 btn btn-numbers"
  >
    0
  </button>
  <button
    @click="handleClick('appendNumber', '.', $event)"
    class="btn btn-numbers"
  >
    .
  </button>
  <button
    v-if="mode === 'math'"
    @click="handleClick('evaluateExpression', null, $event)"
    class="btn btn-equals"
  >
    =
  </button>
</template>

<script setup>
defineProps(["mode"])
const emit = defineEmits([
  "appendNumber",
  "clear",
  "backspace",
  "toggleNegativeValue",
  "setOperation",
  "evaluateExpression",
  "calculateBMI"
])

const handleClick = (eventToEmit, data, e) => {
  // remove focus from the clicked button
  e.target.blur()

  // if there if no data, just emit the name of the custom event
  if (data === null) {
    emit(eventToEmit)
    return
  }
  emit(eventToEmit, data)
}
</script>
