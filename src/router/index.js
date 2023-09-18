import { createRouter, createWebHistory } from "vue-router";

import ViewMath from "@/views/ViewMath.vue";
import ViewAge from "@/views/ViewAge.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/math",
    },
    {
      path: "/math",
      name: "math",
      component: ViewMath,
    },
    {
      path: "/age",
      name: "age",
      component: ViewAge,
    },
  ],
});

export default router;
