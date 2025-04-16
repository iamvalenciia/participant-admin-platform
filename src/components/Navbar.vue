<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Enlaces de navegación con estilo unificado -->
        <div class="flex space-x-4">
          <RouterLink
            to="/"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            active-class="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
          >
            {{ $t("navbar.home") }}
          </RouterLink>
          <RouterLink
            to="/report"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            active-class="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
          >
            {{ $t("navbar.report") }}
          </RouterLink>
          <RouterLink
            to="/advanced-search"
            class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            active-class="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
          >
            {{ $t("navbar.advancedSearch") }}
          </RouterLink>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Selector de idioma simplificado para evitar problemas DOM -->
        <div class="relative">
          <button
            @click="toggleLanguageMenu"
            class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <span>{{ currentLocale === "es" ? "ES" : "EN" }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <Teleport to="body">
            <div
              v-if="showLanguageMenu"
              class="fixed"
              :style="languageMenuPosition"
            >
              <div
                class="w-24 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1">
                  <button
                    @click="changeLocale('es')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Español
                  </button>
                  <button
                    @click="changeLocale('en')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </Teleport>
        </div>

        <button
          @click="toggleTheme"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Cambiar tema"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <button
          @click="logout"
          class="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {{ $t("navbar.logout") }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const { t, locale } = useI18n();

const isDark = computed(() => themeStore.theme === "dark");
const currentLocale = computed(() => locale.value);
const showLanguageMenu = ref(false);
const languageButtonRef = ref<HTMLElement | null>(null);
const languageMenuPosition = ref({ top: "0px", left: "0px" });

const toggleTheme = () => {
  themeStore.toggleTheme();
};

const toggleLanguageMenu = (event: MouseEvent) => {
  // Guardar el elemento que disparó el evento
  languageButtonRef.value = event.currentTarget as HTMLElement;

  // Alternar la visibilidad del menú
  showLanguageMenu.value = !showLanguageMenu.value;

  // Si el menú se va a mostrar, calcular su posición
  if (showLanguageMenu.value) {
    nextTick(() => {
      const rect = languageButtonRef.value?.getBoundingClientRect();
      if (rect) {
        languageMenuPosition.value = {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.right - 96 + window.scrollX}px`, // 96px es el ancho aproximado del menú
        };
      }
    });
  }
};

const changeLocale = (lang: string) => {
  locale.value = lang;
  showLanguageMenu.value = false;
};

const logout = async () => {
  const result = await authStore.logout();
  if (result.success) {
    router.push("/login");
  }
};

// Cerrar el menú al hacer clic en cualquier parte de la página
const handleClickOutside = (event: MouseEvent) => {
  if (!showLanguageMenu.value) return;

  // Si el clic no fue en el botón de idioma, cerrar el menú
  if (
    languageButtonRef.value &&
    !languageButtonRef.value.contains(event.target as Node)
  ) {
    showLanguageMenu.value = false;
  }
};

// Cerrar el menú al cambiar de ruta
watch(
  () => route.fullPath,
  () => {
    showLanguageMenu.value = false;
  }
);

// Agregar listener para cerrar el menú al hacer clic fuera
watch(
  showLanguageMenu,
  (isVisible) => {
    if (isVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  },
  { immediate: true }
);

// Asegurarse de eliminar el listener al destruir el componente
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
