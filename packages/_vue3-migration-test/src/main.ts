import { Component, configureCompat, createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Warnings that cannot be solved in Vue 2 (a.k.a. breaking  changes) are suppressed
const VUE_COMPAT_MODE = Number(import.meta.env.VITE_VUE_COMPAT_MODE);
if (VUE_COMPAT_MODE === 2) {
  configureCompat({
    /**
     * Remove $attrs and $listeners when Vue 3 and `INSTANCE_LISTENERS: false`.
     * Both $attrs and $listeners are inherited (automatically forwarded) to the root component
     * by default:
     * https://vuejs.org/guide/components/attrs#nested-component-inheritance
     * https://github.com/vuejs/core/issues/4566#issuecomment-917997056.
     */
    INSTANCE_LISTENERS: 'suppress-warning',
    RENDER_FUNCTION: false,
    COMPONENT_V_MODEL: false
  });
}

createApp(App as Component)
  .use(router)
  .mount('#app');
