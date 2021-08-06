import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

// Injecting XComponents into the global window object when Cypress is injected for testing purposes
if (Object.prototype.hasOwnProperty.call(window, 'Cypress')) {
  Object.defineProperty(window, 'xcomponents', {
    value: app
  });
}
