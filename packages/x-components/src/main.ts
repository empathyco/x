import 'reflect-metadata';
import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';
import Vue from 'vue';
import App from './App.vue';
import { installX } from './x';

const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .addMapper((_, result: Result) => {
    result.url = `./product_page.html?productId=${result.id}`;
    result.identifier.value = result.id;
    return result;
  }, 'results')
  .build();

Vue.config.productionTip = false;
installX({ adapter,
  xModules: {
    identifierResults: {
      config: {
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    }
  }
});
const app = new Vue({
  render: h => h(App)
}).$mount('#app');

// Injecting XComponents into the global window object when Cypress is injected for testing purposes
if (Object.prototype.hasOwnProperty.call(window, 'Cypress')) {
  Object.defineProperty(window, 'xcomponents', {
    value: app
  });
}
