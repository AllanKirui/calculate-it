<template>
  <!-- Row 1 Buttons -->
  <button @click="$emit('appendNumber', 7)" class="btn btn-numbers">7</button>
  <button @click="$emit('appendNumber', 8)" class="btn btn-numbers">8</button>
  <button @click="$emit('appendNumber', 9)" class="btn btn-numbers">9</button>
  <button
    v-if="mode == 'temp'"
    @click="$emit('clear')"
    class="btn btn-clear row-span-1"
  >
    AC
  </button>
  <button v-else @click="$emit('clear')" class="btn btn-clear row-span-2">
    AC
  </button>

  <!-- Row 2 Buttons -->
  <button @click="$emit('appendNumber', 4)" class="btn btn-numbers">4</button>
  <button @click="$emit('appendNumber', 5)" class="btn btn-numbers">5</button>
  <button @click="$emit('appendNumber', 6)" class="btn btn-numbers">6</button>
  <button
    v-if="mode == 'temp'"
    @click="$emit('backspace')"
    class="btn btn-operators row-span-1"
  >
    &laquo;
  </button>

  <!-- Row 3 Buttons -->
  <button @click="$emit('appendNumber', 1)" class="btn btn-numbers">1</button>
  <button @click="$emit('appendNumber', 2)" class="btn btn-numbers">2</button>
  <button @click="$emit('appendNumber', 3)" class="btn btn-numbers">3</button>
  <button
    v-if="mode == 'temp'"
    @click="$emit('toggleNegativeValue')"
    class="btn btn-operators row-span-1"
  >
    +/-
  </button>
  <button
    v-else
    @click="$emit('backspace')"
    class="btn btn-operators row-span-2"
  >
    &laquo;
  </button>

  <!-- Row 4 Buttons -->
  <button @click="$emit('appendNumber', 0)" class="col-start-2 btn btn-numbers">
    0
  </button>
  <button @click="$emit('appendNumber', '.')" class="btn btn-numbers">.</button>
</template>

<script setup>
defineProps(["mode"])
defineEmits(["appendNumber", "clear", "backspace", "toggleNegativeValue"])
</script>
