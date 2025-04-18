<template>
  <div class="app-container" :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col"
    >
      <Navbar />
      <main class="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <footer
        class="py-4 text-center text-sm text-gray-500 dark:text-gray-400 mt-auto"
      >
        <div>
          &copy; {{ new Date().getFullYear() }} - {{ $t("footer.message") }}
        </div>
        <div>Juan Pablo Valencia</div>
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();

const authStore = useAuthStore();
const themeStore = useThemeStore();

const isAuthenticated = computed(() => authStore.isAuthenticated());
const isDark = computed(() => themeStore.theme === "dark");

onMounted(async () => {
  await authStore.initAuth();
});
</script>

<style>
/* Base styles */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

:root {
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
}

* {
  font-family: "Inter", sans-serif;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
