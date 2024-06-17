import { createRouter, createWebHistory } from "vue-router"

import ViewMath from "@/views/ViewMath.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/calculate-it/math"
    },
    {
      path: "/calculate-it",
      redirect: "/calculate-it/math"
    },
    {
      path: "/calculate-it/math",
      name: "math",
      component: ViewMath
    },
    {
      path: "/calculate-it/bmi",
      name: "bmi",
      component: () => import("../views/ViewBMI.vue")
    },
    {
      path: "/calculate-it/mass",
      name: "mass",
      component: () => import("../views/ViewMass.vue")
    },
    {
      path: "/calculate-it/length",
      name: "length",
      component: () => import("../views/ViewLength.vue")
    },
    {
      path: "/calculate-it/time",
      name: "time",
      component: () => import("../views/ViewTime.vue")
    },
    {
      path: "/calculate-it/speed",
      name: "speed",
      component: () => import("../views/ViewSpeed.vue")
    },
    {
      path: "/calculate-it/temperature",
      name: "temperature",
      component: () => import("../views/ViewTemp.vue")
    },
    {
      path: "/calculate-it/about",
      name: "about",
      component: () => import("../views/ViewAbout.vue")
    },
    { path: "/:notFound(.*)", redirect: "/calculate-it/math" },
    { path: "/calculate-it/:notFound(.*)", redirect: "/calculate-it/math" }
  ]
})

export default router
