import 'reflect-metadata';
import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import Vue from 'vue';
import App from './App.vue';
import { XPlugin } from './plugins';

const adapter = new EmpathyAdapterBuilder().setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .build();
Vue.config.productionTip = false;
Vue.use(XPlugin, {
  adapter
});
new Vue({
  render: h => h(App)
}).$mount('#app');
