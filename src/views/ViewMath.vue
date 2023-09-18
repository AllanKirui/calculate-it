<template>
  <!-- The Output -->
  <div
    class="overflow-x-hidden relative flex flex-col justify-end gap-2 min-h-[150px] p-5 bg-liver text-sandy-brown rounded-xl">
    <!-- Blurred Left & Right Edges For Previous Operations -->
    <div class="absolute top-4 left-4 w-5 h-8 bg-liver blur-md z-10"></div>
    <div class="absolute top-4 right-0 w-5 h-8 bg-liver blur-lg z-10"></div>

    <!-- Previous Operations -->
    <div class="horizontally-scrollable pb-1 text-right whitespace-nowrap overflow-x-auto">
      <span class="ml-5">6 x 7 = 42</span>
    </div>

    <!-- Current Operation -->
    <div class="text-right">
      <!-- Operation -->
      <h2 class="text-3xl md:text-4xl text-navajo-white">1,234 + 10</h2>

      <!-- Result -->
      <h3 class="mt-1 text-2xl md:text-3xl">= 1,244</h3>
    </div>
  </div>

  <!-- The Buttons -->
  <div class="grid grid-cols-4 grid-rows-4 gap-2 text-2xl mt-3">
    <!-- Row 1 Buttons -->
    <button class="btn btn-clear">AC</button>
    <button class="btn btn-operators">C</button>
    <button class="btn btn-operators">%</button>
    <button class="btn btn-operators">÷</button>

    <!-- Row 2 Buttons -->
    <button class="btn btn-numbers">7</button>
    <button class="btn btn-numbers">8</button>
    <button class="btn btn-numbers">9</button>
    <button class="btn btn-operators">×</button>

    <!-- Row 3 Buttons -->
    <button class="btn btn-numbers">4</button>
    <button class="btn btn-numbers">5</button>
    <button class="btn btn-numbers">6</button>
    <button class="btn btn-operators">-</button>

    <!-- Row 4 Buttons -->
    <button class="btn btn-numbers">1</button>
    <button class="btn btn-numbers">2</button>
    <button class="btn btn-numbers">3</button>
    <button class="btn btn-operators">+</button>

    <!-- Row 5 Buttons -->
    <button class="col-start-2 btn btn-numbers">0</button>
    <button class="btn btn-numbers">.</button>
    <button class="btn btn-equals">=</button>
  </div>
</template>