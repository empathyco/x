import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/home/Home.vue')
  },
  {
    path: '/products/:id',
    name: 'Product page',
    component: () => import('./views/pdp.vue')
  }
];

if (process.env.NODE_ENV !== 'production') {
  routes.push(
    {
      path: '/fixed-header-layout',
      name: 'Fixed Header Layout',
      component: () => import('./views/layouts/fixed-header-and-asides-layout.vue')
    },
    {
      path: '/multi-column-layout',
      name: 'Multi Column Layout',
      component: () => import('./views/layouts/multi-column-layout.vue')
    },
    {
      path: '/single-column-layout',
      name: 'Single Column Layout',
      component: () => import('./views/layouts/single-column-layout.vue')
    },
    {
      path: '/design-system',
      name: 'Design System',
      component: () => import('./views/design-system/design-system.vue')
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
      path: '/infinite-scroll-container',
      name: 'Infinite Scroll Container',
      component: () => import('./views/infinite-scroll.vue')
    },
    {
      path: '/infinite-scroll-document',
      name: 'Infinite Scroll Document',
      component: () => import('./views/infinite-scroll-document.vue')
    },
    {
      path: '/infinite-scroll-html',
      name: 'Infinite Scroll HTML',
      component: () => import('./views/infinite-scroll-html.vue')
    },
    {
      path: '/infinite-scroll-body',
      name: 'Infinite Scroll Body',
      component: () => import('./views/infinite-scroll-body.vue')
    }
  );
}

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
