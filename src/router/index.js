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
      path: "/age",
      name: "age",
      component: () => import("../views/ViewAge.vue")
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
    }
  ]
})

export default router
