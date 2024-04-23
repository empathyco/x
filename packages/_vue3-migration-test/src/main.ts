import { Component, configureCompat, createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Warnings that cannot be solved in Vue 2 (a.k.a. breaking  changes) are suppressed
const VUE_COMPAT_MODE = Number(import.meta.env.VITE_VUE_COMPAT_MODE);
if (VUE_COMPAT_MODE === 2) {
  configureCompat({
    INSTANCE_LISTENERS: 'suppress-warning',
    RENDER_FUNCTION: false,
    COMPONENT_V_MODEL: false
  });
}

createApp(App as Component)
  .use(router)
  .mount('#app');
