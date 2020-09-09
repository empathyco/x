import 'reflect-metadata';
import { installX } from '@empathy/x-components';
import Vue from 'vue';
import App from './App.vue';
import { createI18NInstance } from './i18n/index';
import store from './store';
import { xPluginOptions } from './x-components/plugin.options';

Vue.config.productionTip = false;

installX({ ...xPluginOptions, store });
const { i18n, setLocale } = createI18NInstance({ locale: 'en' });

(window as any)['setLocale'] = setLocale; // Only for testing

new Vue({
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');
