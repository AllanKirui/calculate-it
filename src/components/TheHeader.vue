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
                alt="calculator icon"
              />
              <span>Math</span>
            </RouterLink>
          </li>

          <!-- BMI Calculator -->
          <li>
            <a href="#">
              <img
                src="../assets/img/bmi.svg"
                width="24"
                height="24"
                alt="bathroom scale icon"
              />
              <span>BMI</span>
            </a>
          </li>

          <!-- Mass Converter -->
          <li>
            <RouterLink to="mass">
              <img
                src="../assets/img/mass.svg"
                width="24"
                height="24"
                alt="weight icon"
              />
              <span>Mass</span>
            </RouterLink>
          </li>

          <!-- Length Converter -->
          <li>
            <RouterLink to="length">
              <img
                src="../assets/img/length.svg"
                width="24"
                height="24"
                alt="ruler icon"
              />
              <span>Length</span>
            </RouterLink>
          </li>

          <!-- Time Converter -->
          <li>
            <RouterLink to="time">
              <img
                src="../assets/img/time.svg"
                width="24"
                height="24"
                alt="clock icon"
              />
              <span>Time</span>
            </RouterLink>
          </li>

          <!-- Speed Converter -->
          <li>
            <RouterLink to="speed">
              <img
                src="../assets/img/speed.svg"
                width="24"
                height="24"
                alt="speed meter icon"
              />
              <span>Speed</span>
            </RouterLink>
          </li>

          <!-- Temperature Converter -->
          <li>
            <RouterLink to="temperature">
              <img
                src="../assets/img/temperature.svg"
                width="24"
                height="24"
                alt="thermometer icon"
              />
              <span>Temperature</span>
            </RouterLink>
          </li>

          <!-- Currency Converter -->
          <li>
            <a href="#">
              <img
                src="../assets/img/currency.svg"
                width="24"
                height="24"
                alt="dollar sign icon"
              />
              <span>Currency</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
