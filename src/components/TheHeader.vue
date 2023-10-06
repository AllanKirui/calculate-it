<template>
  <!-- The Header -->
  <header>
    <nav class="flex flex-col items-center">
      <!-- Nav Top -->
      <div class="hidden md:block">
        <h1 class="text-4xl md:text-5xl">Calculate It!</h1>
      </div>

      <!-- Nav Bottom -->
      <div class="relative mt-3 overflow-x-hidden w-full">
        <!-- Blurred Left & Right Edges to Hint at Horizontal Scrolling on Mobile Screens -->
        <div class="nav-blur nav-blur-left"></div>
        <div class="nav-blur nav-blur-right"></div>

        <ul class="links-wrapper scrollable pb-1 px-4 flex gap-4 md:justify-center md:text-lg overflow-x-auto">
          <li>
            <RouterLink to="math">
              <img src="../assets/img/calculator.svg" width="24" height="24" alt="">
              <span class="">Math</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink to="age">
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