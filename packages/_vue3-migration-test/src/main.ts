import { XComponentsAdapter } from '@empathyco/x-types';
import { Component, configureCompat, createApp } from 'vue';
import { xPlugin } from '../../x-components/src/plugins/x-plugin';
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

const adapter = {} as XComponentsAdapter;

createApp(App as Component)
  .use(router)
  .use(xPlugin, { adapter })
  .mount('#app');
