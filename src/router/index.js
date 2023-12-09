import { createRouter, createWebHistory } from "vue-router"

import ViewMath from "@/views/ViewMath.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ]
})

export default router
