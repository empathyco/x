import 'reflect-metadata';
import { installX } from '@empathy/x-components';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { xPluginOptions } from './x-components/plugin.options';

Vue.config.productionTip = false;

installX({ ...xPluginOptions, store });

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
