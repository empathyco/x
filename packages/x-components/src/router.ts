import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'app',
    component: () => import('./views/FullApp.vue')
  },
  {
    path: '/full-empathize',
    name: 'full-empathize',
    component: () => import('./views/FullEmpathize.vue')
  },
  {
    path: '/full-no-empathize',
    name: 'full-no-empathize',
    component: () => import('./views/FullNoEmpathize.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
