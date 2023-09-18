<template>
  <!-- The Header -->
  <header>
    <nav class="flex flex-col items-center">
      <!-- Nav Top -->
      <div class="flex justify-between">
        <h1 class="text-5xl">Calculate It!</h1>
      </div>

      <!-- Nav Bottom -->
      <div class="mt-3">
        <ul class="links-wrapper flex gap-4 text-lg">
          <li>
            <RouterLink to="math" :class="[$route.name === 'math' ? 'active' : '']">
              <img src="../assets/img/calculator.svg" width="24" height="24" alt="">
              <span class="">Math</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="age" :class="[$route.name === 'age' ? 'active' : '']">
              <img src="../assets/img/age.svg" width="24" height="24" alt="">
              <span class="">Age</span>
            </RouterLink>
          </li>

          <li>
            <a href="#">
              <img src="../assets/img/bmi.svg" width="24" height="24" alt="">
              <span class="">BMI</span>
            </a>
          </li>

          <li>
            <a href="#">
              <img src="../assets/img/length.svg" width="24" height="24" alt="">
              <span class="">Length</span>
            </a>
          </li>

          <li>
            <a href="#">
              <img src="../assets/img/mass.svg" width="24" height="24" alt="">
              <span class="">Mass</span>
            </a>
          </li>

          <li>
            <a href="#">
              <img src="../assets/img/temperature.svg" width="24" height="24" alt="">
              <span class="">Temperature</span>
            </a>
          </li>

          <li>
            <a href="#">
              <img src="../assets/img/currency.svg" width="24" height="24" alt="">
              <span class="">Currency</span>
            </a>
          </li>

          <!-- <li><a href="#">Length</a></li>
          <li><a href="#">Mass</a></li>
          <li><a href="#">Temperature</a></li>
          <li><a href="#">Currency</a></li> -->
        </ul>
      </div>
    </nav>
  </header>
</template>