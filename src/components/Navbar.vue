<template>
  <nav class="bg-amber-50 dark:bg-teal-950 shadow-sm">
    <div class="container mx-auto px-4 py-3">
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- Navigation links with unified style -->
          <div class="flex space-x-4">
            <RouterLink
              to="/"
              class="px-3 py-2 text-sm font-medium text-teal-800 dark:text-amber-100 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              active-class="text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500 dark:border-yellow-400"
            >
              {{ $t("navbar.home") }}
            </RouterLink>

            <template v-if="isAuthenticated">
              <RouterLink
                to="/report"
                class="px-3 py-2 text-sm font-medium text-teal-800 dark:text-amber-100 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                active-class="text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500 dark:border-yellow-400"
              >
                {{ $t("navbar.report") }}
              </RouterLink>
              <RouterLink
                to="/advanced-search"
                class="px-3 py-2 text-sm font-medium text-teal-800 dark:text-amber-100 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                active-class="text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-500 dark:border-yellow-400"
              >
                {{ $t("navbar.advancedSearch") }}
              </RouterLink>
            </template>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Language selector -->
          <div class="relative">
            <button
              @click="toggleLanguageMenu"
              class="flex items-center px-3 py-2 text-sm font-medium text-teal-800 dark:text-amber-100 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
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
                  class="w-24 rounded-md shadow-lg bg-amber-50 dark:bg-teal-900 ring-1 ring-amber-200 dark:ring-teal-800 ring-opacity-80 z-10"
                >
                  <div class="py-1">
                    <button
                      @click="changeLocale('es')"
                      class="block w-full text-left px-4 py-2 text-sm text-teal-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-teal-800"
                    >
                      Español
                    </button>
                    <button
                      @click="changeLocale('en')"
                      class="block w-full text-left px-4 py-2 text-sm text-teal-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-teal-800"
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>

          <!-- Theme button -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-teal-800 transition-colors"
            aria-label="Change theme"
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
              class="h-5 w-5 text-teal-700"
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

          <!-- Login / Logout button -->
          <button
            v-if="isAuthenticated"
            @click="logout"
            class="px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {{ $t("navbar.logout") }}
          </button>
          <RouterLink
            v-else
            to="/login"
            class="px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            {{ $t("login.login_button") }}
          </RouterLink>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="flex md:hidden items-center justify-between">
        <!-- Logo or Brand -->
        <RouterLink
          to="/"
          class="text-teal-800 dark:text-amber-100 font-medium"
        >
          <span class="text-yellow-600 dark:text-yellow-400">pfj</span>2025
        </RouterLink>

        <!-- Mobile navigation controls -->
        <div class="flex items-center space-x-2">
          <!-- Theme toggle (always visible) -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-full hover:bg-amber-100 dark:hover:bg-teal-800 transition-colors"
            aria-label="Change theme"
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
              class="h-5 w-5 text-teal-700"
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

          <!-- Hamburger menu button -->
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-md text-teal-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-teal-800 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <svg
              v-if="!mobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu (conditionally rendered) -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-3 pb-2 border-t border-amber-200 dark:border-teal-800"
      >
        <div class="pt-2 pb-1 space-y-1">
          <RouterLink
            to="/"
            class="block px-3 py-2 text-base font-medium text-teal-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-teal-800 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-md transition-colors"
            active-class="bg-amber-100 dark:bg-teal-800 text-yellow-600 dark:text-yellow-400"
            @click="mobileMenuOpen = false"
          >
            {{ $t("navbar.home") }}
          </RouterLink>

          <template v-if="isAuthenticated">
            <RouterLink
              to="/report"
              class="block px-3 py-2 text-base font-medium text-teal-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-teal-800 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-md transition-colors"
              active-class="bg-amber-100 dark:bg-teal-800 text-yellow-600 dark:text-yellow-400"
              @click="mobileMenuOpen = false"
            >
              {{ $t("navbar.report") }}
            </RouterLink>
            <RouterLink
              to="/advanced-search"
              class="block px-3 py-2 text-base font-medium text-teal-800 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-teal-800 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-md transition-colors"
              active-class="bg-amber-100 dark:bg-teal-800 text-yellow-600 dark:text-yellow-400"
              @click="mobileMenuOpen = false"
            >
              {{ $t("navbar.advancedSearch") }}
            </RouterLink>
          </template>
        </div>

        <!-- Language selector in mobile menu -->
        <div class="pt-2 pb-1">
          <div
            class="px-3 py-2 text-base font-medium text-teal-800 dark:text-amber-100"
          >
            {{ $t("navbar.language") || "Language" }}:
          </div>
          <div class="flex px-3 space-x-2">
            <button
              @click="
                changeLocale('es');
                mobileMenuOpen = false;
              "
              class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              :class="
                currentLocale === 'es'
                  ? 'bg-teal-600 text-white'
                  : 'bg-amber-100 dark:bg-teal-800 text-teal-800 dark:text-amber-100'
              "
            >
              Español
            </button>
            <button
              @click="
                changeLocale('en');
                mobileMenuOpen = false;
              "
              class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              :class="
                currentLocale === 'en'
                  ? 'bg-teal-600 text-white'
                  : 'bg-amber-100 dark:bg-teal-800 text-teal-800 dark:text-amber-100'
              "
            >
              English
            </button>
          </div>
        </div>

        <!-- Login/Logout button in mobile menu -->
        <div class="pt-4 pb-1">
          <div class="px-3">
            <button
              v-if="isAuthenticated"
              @click="
                logout();
                mobileMenuOpen = false;
              "
              class="w-full px-3 py-2 text-base font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              {{ $t("navbar.logout") }}
            </button>
            <RouterLink
              v-else
              to="/login"
              class="block w-full text-center px-3 py-2 text-base font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              @click="mobileMenuOpen = false"
            >
              {{ $t("login.login_button") }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onUnmounted, onMounted } from "vue";
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
const mobileMenuOpen = ref(false);

const isAuthenticated = computed(() => !!authStore.user);

const toggleTheme = () => {
  themeStore.toggleTheme();
};

const toggleLanguageMenu = (event: MouseEvent) => {
  // Store the element that triggered the event
  languageButtonRef.value = event.currentTarget as HTMLElement;

  // Toggle menu visibility
  showLanguageMenu.value = !showLanguageMenu.value;

  // If the menu will be displayed, calculate its position
  if (showLanguageMenu.value) {
    nextTick(() => {
      const rect = languageButtonRef.value?.getBoundingClientRect();
      if (rect) {
        languageMenuPosition.value = {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.right - 96 + window.scrollX}px`, // 96px is approximately the width of the menu
        };
      }
    });
  }
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;

  // Close language menu if it's open
  if (mobileMenuOpen.value && showLanguageMenu.value) {
    showLanguageMenu.value = false;
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

// Close the menu when clicking anywhere on the page
const handleClickOutside = (event: MouseEvent) => {
  if (!showLanguageMenu.value) return;

  // If the click wasn't on the language button, close the menu
  if (
    languageButtonRef.value &&
    !languageButtonRef.value.contains(event.target as Node)
  ) {
    showLanguageMenu.value = false;
  }
};

// Handle window resize to manage mobile menu state
const handleResize = () => {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
};

// Close menu when changing routes
watch(
  () => route.fullPath,
  () => {
    showLanguageMenu.value = false;
    mobileMenuOpen.value = false;
  }
);

// Add listener to close menu when clicking outside
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

// Add resize event listener
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

// Make sure to remove listeners when component is destroyed
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
});
</script>
