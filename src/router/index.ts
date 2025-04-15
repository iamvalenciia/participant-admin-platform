import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import ParticipantDetailView from "../views/ParticipantDetailView.vue";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { redirectIfAuth: true },
    },
    {
      path: "/participant/:id",
      name: "participant-detail",
      component: ParticipantDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

// Navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Redirigir al home si el usuario está autenticado e intenta acceder al login
  if (to.meta.redirectIfAuth && authStore.isAuthenticated()) {
    next({ name: "home" });
    return;
  }

  // Verificar rutas protegidas
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
