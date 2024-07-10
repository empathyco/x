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
      path: '/xds',
      name: 'XDS',
      component: () => import('@empathyco/x-tailwindcss/showcase').then(m => m.XdsShowcase)
    },
    {
      path: '/result-app',
      name: 'result-app',
      component: () => import('./views/ResultApp.vue')
    },
    {
      path: '/accessibility-check',
      name: 'Accessibility Check',
      component: () => import('./views/accessibility/accessibility-check.vue'),
      children: [
        {
          path: 'wai-base-event-button',
          name: 'Base Event Button',
          component: () => import('./views/accessibility/wai-base-event-button.vue')
        },
        {
          path: 'wai-base-dropdown-and-base-switch',
          name: 'Base Dropdown and Base Switch',
          component: () => import('./views/accessibility/wai-base-dropdown-and-base-switch.vue')
        },
        {
          path: 'wai-base-result-link',
          name: 'Base Result Link',
          component: () => import('./views/accessibility/wai-base-result-link.vue')
        }
      ]
    }
  );
}

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
