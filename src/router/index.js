import { createRouter, createWebHistory } from "vue-router"

import ViewMath from "@/views/ViewMath.vue"

const router = createRouter({
  history: createWebHistory("/calculate-it/"),
  routes: [
    {
      path: "/",
      redirect: "/math"
    },
    {
      path: "/math",
      name: "math",
      component: ViewMath
    },
    {
      path: "/bmi",
      name: "bmi",
      component: () => import("../views/ViewBMI.vue")
    },
    {
      path: "/mass",
      name: "mass",
      component: () => import("../views/ViewMass.vue")
    },
    {
      path: "/length",
      name: "length",
      component: () => import("../views/ViewLength.vue")
    },
    {
      path: "/time",
      name: "time",
      component: () => import("../views/ViewTime.vue")
    },
    {
      path: "/speed",
      name: "speed",
      component: () => import("../views/ViewSpeed.vue")
    },
    {
      path: "/temperature",
      name: "temperature",
      component: () => import("../views/ViewTemp.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/ViewAbout.vue")
    },
    { path: "/:pathMatch(.*)*", redirect: "/math" }
  ]
})

export default router
