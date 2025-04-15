import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";
import i18n from "./i18n";

// Crear la instancia de Pinia
const pinia = createPinia();

// Crear y montar la aplicación
const app = createApp(App);

// Registrar plugins
app.use(pinia);
app.use(router);
app.use(i18n); // Añadimos el plugin i18n

// Montar la aplicación
app.mount("#app");
