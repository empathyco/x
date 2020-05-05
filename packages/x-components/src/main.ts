import 'reflect-metadata';
import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import Vue from 'vue';
import App from './App.vue';
import { installX } from './x';

const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .build();

installX({ adapter });
const app = new Vue({
  render: h => h(App)
}).$mount('#app');

// Injecting XComponents into the global window object when Cypress is injected for testing purposes
if (window.hasOwnProperty('Cypress')) {
  Object.defineProperty(window, 'xcomponents', {
    value: app
  });
}
