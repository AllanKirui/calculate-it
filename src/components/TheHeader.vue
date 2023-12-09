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

        <ul
          class="links-wrapper scrollable pb-1 px-4 flex gap-4 md:justify-center md:text-lg overflow-x-auto"
        >
          <!-- Basic Math Calculator -->
          <li>
            <RouterLink to="math">
              <img
                src="../assets/img/calculator.svg"
                width="24"
                height="24"
                alt=""
              />
              <span class="">Math</span>
            </RouterLink>
          </li>

          <!-- BMI Calculator -->
          <li>
            <a href="#">
              <img src="../assets/img/bmi.svg" width="24" height="24" alt="" />
              <span class="">BMI</span>
            </a>
          </li>

          <!-- Length Converter -->
          <li>
            <router-link to="length">
              <img
                src="../assets/img/length.svg"
                width="24"
                height="24"
                alt=""
              />
              <span class="">Length</span>
            </router-link>
          </li>

          <!-- Mass Converter -->
          <li>
            <RouterLink to="mass">
              <img src="../assets/img/mass.svg" width="24" height="24" alt="" />
              <span class="">Mass</span>
            </RouterLink>
          </li>

          <!-- Time Converter -->
          <li>
            <RouterLink to="time">
              <!-- TODO add time icon -->
              <img src="" width="24" height="24" alt="" />
              <span class="">Time</span>
            </RouterLink>
          </li>

          <!-- Time Converter -->
          <li>
            <RouterLink to="speed">
              <!-- TODO add speed icon, remove empty class attributes from spans -->
              <img src="" width="24" height="24" alt="" />
              <span class="">Speed</span>
            </RouterLink>
          </li>

          <!-- Temperature Converter -->
          <li>
            <a href="#">
              <img
                src="../assets/img/temperature.svg"
                width="24"
                height="24"
                alt=""
              />
              <span class="">Temperature</span>
            </a>
          </li>

          <!-- Currency Converter -->
          <li>
            <a href="#">
              <img
                src="../assets/img/currency.svg"
                width="24"
                height="24"
                alt=""
              />
              <span class="">Currency</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
