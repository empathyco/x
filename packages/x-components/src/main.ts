import Vue from 'vue';
import 'reflect-metadata';
import App from './App.vue';
import { XPlugin } from './plugins';

Vue.config.productionTip = false;
Vue.use(XPlugin);
new Vue({
  render: h => h(App)
}).$mount('#app');
