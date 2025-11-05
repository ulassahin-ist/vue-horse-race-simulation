import { createApp } from "vue";
import "./style.css"; // Global styles
import App from "./App.vue";
import store from "./store"; // Vuex store

// Create and mount app with global store
createApp(App).use(store).mount("#app");

// Test Globalisation
if (import.meta.env.VITE_E2E === "true") {
  window.__E2E__ = true;
  window.__store__ = store;
  console.log(" E2E MODE ACTIVE");
}
