import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('./views/Layout.vue')
  },
  {
    path: '/fixed-header-layout',
    name: 'Fixed Header Layout',
    component: () => import('./views/layouts/fixed-header-and-asides-layout.vue')
  },
  {
    path: '/single-column-layout',
    name: 'Single Column Layout',
    component: () => import('./views/layouts/single-column-layout.vue')
  },
  {
    path: '/multi-column-layout',
    name: 'Multi Column Layout',
    component: () => import('./views/layouts/multi-column-layout.vue')
  },
  {
    path: '/design-system',
    name: 'Design System',
    component: () => import('./views/design-system.vue')
  },
  {
    path: '/empathize',
    name: 'empathize',
    component: () => import('./views/empathize.vue')
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
    path: '/test/history-queries',
    name: 'History Queries',
    component: () => import('./views/history-queries.vue')
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
  },
  {
    path: '/test/next-queries',
    name: 'Next Queries',
    component: () => import('./views/next-queries.vue')
  },
  {
    path: '/test/related-tags',
    name: 'Related Tags',
    component: () => import('./views/related-tags.vue')
  },
  {
    path: '/test/base-events-modal',
    name: 'Events Modal',
    component: () => import('./views/base-events-modal.vue')
  },
  {
    path: '/test/base-result-image',
    name: 'Result Image',
    component: () => import('./views/base-result-image.vue')
  },
  {
    path: '/test/keyboard-navigation',
    name: 'Keyboard Navigation',
    component: () => import('./views/keyboard-navigation.vue')
  },
  {
    path: '/test/base-filters-search',
    name: 'Filters Search',
    component: () => import('./views/filters-search.vue')
  },
  {
    path: '/test/sliding-panel',
    name: 'Sliding Panel',
    component: () => import('./views/sliding-panel.vue')
  },
  {
    path: '/test/base-column-picker',
    name: 'Base Column Picker',
    component: () => import('./views/base-column-picker.vue')
  },
  {
    path: '/test/sort',
    name: 'Search Sort',
    component: () => import('./views/sort.vue')
  },
  {
    path: '/test/exclude-filters',
    name: 'Exclude Filters',
    component: () => import('./views/exclude-filters.vue')
  },
  {
    path: '/test/infinite-scroll',
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
  },
  {
    path: '/test/sliced-filters',
    name: 'Sliced Filters',
    component: () => import('./views/sliced-filters.vue')
  },
  {
    path: '/test/multiselect-filters',
    name: 'MultiSelect Filters',
    component: () => import('./views/multiselect-filters.vue')
  },
  {
    path: '/test/identifier-results',
    name: 'Identifier Results',
    component: () => import('./views/identifier-results.vue')
  },
  {
    path: '/test/partial-results',
    name: 'Partial Results',
    component: () => import('./views/partial-results.vue')
  },
  {
    path: '/test/spellcheck',
    name: 'Spellcheck',
    component: () => import('./views/spellcheck.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
