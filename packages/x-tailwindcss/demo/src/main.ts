import './css/index.pcss';
import Vue from 'vue';
import XdsShowcase from './components/xds-showcase.vue';

new Vue({
  render(h) {
    return h(XdsShowcase);
  }
}).$mount('#app');
