import './css/index.pcss';
import Vue from 'vue';
import XdsShowCase from './components/xds-showcase.vue';

new Vue({
  render(h) {
    return h(XdsShowCase);
  }
}).$mount('#app');
