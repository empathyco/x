import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import { setupDevtools } from './plugins/devtools/devtools.plugin';
import { xPlugin } from './plugins/x-plugin';
import router from './router';
import { baseInstallXOptions } from './views/base-config';

Vue.config.productionTip = false;
Vue.use(xPlugin, baseInstallXOptions);
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
setupDevtools(app);

// Injecting XComponents into the global window object when Cypress is injected for testing purposes
if (Object.prototype.hasOwnProperty.call(window, 'Cypress')) {
  Object.defineProperty(window, 'xcomponents', {
    value: app
  });
}
