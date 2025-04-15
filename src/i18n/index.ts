// src/i18n/index.ts
import { createI18n } from "vue-i18n";
import es from "./locales/es.json";
import en from "./locales/en.json";

// Tipo para el mensaje almacenado en localStorage
type LocaleMessage = "es" | "en";

// Obtener la configuración regional del navegador o usar el valor guardado
const savedLocale = localStorage.getItem("locale");
const locale = savedLocale ? (savedLocale as LocaleMessage) : "es"; // Español por defecto

// Guardar la selección en localStorage
localStorage.setItem("locale", locale);

const i18n = createI18n({
  legacy: false, // Habilitar la Composition API
  locale: locale,
  fallbackLocale: "es", // Idioma de respaldo
  messages: {
    es,
    en,
  },
});

export default i18n;
