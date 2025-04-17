<template>
  <div class="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="mb-4">
        <h2
          class="text-center text-2xl font-bold text-teal-900 dark:text-amber-100"
        >
          {{ $t("login.title") }}
        </h2>
        <p class="mt-1 text-center text-sm text-teal-700 dark:text-amber-200">
          {{ $t("login.subtitle") }}
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-3">
          <div>
            <label for="email" class="sr-only">{{ $t("login.email") }}</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 placeholder-teal-500 dark:placeholder-amber-300 text-teal-900 dark:text-amber-100 dark:bg-teal-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm transition-colors"
              :placeholder="$t('login.email')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{
              $t("login.password")
            }}</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-amber-300 dark:border-teal-700 placeholder-teal-500 dark:placeholder-amber-300 text-teal-900 dark:text-amber-100 dark:bg-teal-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm transition-colors"
              :placeholder="$t('login.password')"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-70 transition-colors"
          >
            <span
              v-if="loading"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <svg
                class="animate-spin h-5 w-5 text-teal-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? $t("login.loading") : $t("login.login_button") }}
          </button>
        </div>

        <div
          v-if="errorMessage"
          class="p-3 bg-red-100 text-red-800 rounded-md text-center"
        >
          {{ errorMessage }}
        </div>
      </form>

      <div class="mt-3 text-center">
        <!-- Botón para cambiar el tema -->
        <button
          @click="toggleTheme"
          class="inline-block text-xs text-teal-700 dark:text-amber-200 hover:text-yellow-600 dark:hover:text-yellow-400 mx-2 transition-colors"
        >
          <span v-if="isDark">{{ $t("login.theme_light") }}</span>
          <span v-else>{{ $t("login.theme_dark") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useI18n } from "vue-i18n";

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const { t, locale } = useI18n();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = computed(() => authStore.loading);
const isDark = computed(() => themeStore.theme === "dark");

const toggleTheme = () => {
  themeStore.toggleTheme();
};

// Función para cambiar el idioma
const toggleLanguage = () => {
  const newLocale = locale.value === "es" ? "en" : "es";
  locale.value = newLocale;
  localStorage.setItem("locale", newLocale);
};

const handleLogin = async () => {
  errorMessage.value = "";

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    router.push("/");
  } else {
    errorMessage.value = result.error || t("login.error");
  }
};

onMounted(() => {
  // Redireccionar si ya está autenticado
  if (authStore.isAuthenticated()) {
    router.push("/");
  }
});
</script>
