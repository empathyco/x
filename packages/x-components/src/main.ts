import 'reflect-metadata';
import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import Vue from 'vue';
import App from './App.vue';
import { XPlugin } from './plugins';

Vue.config.productionTip = false;
Vue.use(XPlugin, { adapter: new EmpathyAdapterBuilder().build() });
new Vue({
  render: h => h(App)
}).$mount('#app');
