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
  },
  {
    path: '/result-app',
    name: 'result-app',
    component: () => import('./views/ResultApp.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('./views/Search.vue')
  },
  {
    path: '/test/search-box',
    name: 'Search Box',
    component: () => import('./views/search-box.vue')
  },
  {
    path: '/test/popular-searches',
    name: 'Popular Searches',
    component: () => import('./views/popular-searches.vue')
  },
  {
    path: '/test/query-suggestions',
    name: 'Query Suggestions',
    component: () => import('./views/query-suggestions.vue')
  },
  {
    path: '/test/recommendations',
    name: 'Recommendations',
    component: () => import('./views/recommendations.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
