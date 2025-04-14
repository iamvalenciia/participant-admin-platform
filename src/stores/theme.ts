import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

type Theme = "light" | "dark";

export const useThemeStore = defineStore("theme", () => {
  // Obtener preferencia del sistema o valor almacenado
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      return savedTheme;
    }

    // Verificar preferencia del sistema
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  };

  const theme = ref<Theme>(getInitialTheme());

  // Aplicar tema al DOM
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Guardar en localStorage
    localStorage.setItem("theme", newTheme);
  };

  // Cambiar tema
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  // Aplicar tema inicial
  applyTheme(theme.value);

  // Observar cambios en el tema
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    toggleTheme,
    isDark: computed(() => theme.value === "dark"),
  };
});
