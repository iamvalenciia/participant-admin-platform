import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";

// Crear la instancia de Pinia
const pinia = createPinia();

// Crear y montar la aplicación
const app = createApp(App);

// Registrar plugins
app.use(pinia);
app.use(router);

// Montar la aplicación
app.mount("#app");
