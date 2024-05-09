import { createRouter, createWebHistory } from 'vue-router';
import {
  TestAnimateWidth,
  TestBaseColumnPickerDropdown,
  TestBaseColumnPickerList,
  TestBaseDropdown,
  TestBaseEventButton,
  TestClearFilters,
  TestFacets,
  TestFade,
  TestScroll,
  TestSelectedFilters,
  TestSelectedFiltersList,
  TestSortDropdown,
  TestSortList,
  TestSortPickerList
} from './';

const routes = [
  {
    path: '/animate-width',
    name: 'AnimateWidth',
    component: TestAnimateWidth
  },
  {
    path: '/fade',
    name: 'Fade',
    component: TestFade
  },
  {
    path: '/base-dropdown',
    name: 'BaseDropdown',
    component: TestBaseDropdown
  },
  {
    path: '/base-event-button',
    name: 'BaseEventButton',
    component: TestBaseEventButton
  },
  {
    path: '/base-column-picker-dropdown',
    name: 'BaseColumnPickerDropdown',
    component: TestBaseColumnPickerDropdown
  },
  {
    path: '/base-column-picker-list',
    name: 'BaseColumnPickerList',
    component: TestBaseColumnPickerList
  },
  {
    path: '/facets',
    name: 'Facets',
    component: TestFacets
  },
  {
    path: '/selected-filters',
    name: 'SelectedFilters',
    component: TestSelectedFilters
  },
  {
    path: '/selected-filters-list',
    name: 'SelectedFiltersList',
    component: TestSelectedFiltersList
  },
  {
    path: '/clear-filters',
    name: 'ClearFilters',
    component: TestClearFilters
  },
  {
    path: '/scroll',
    name: 'Scroll',
    component: TestScroll
  },
  {
    path: '/sort-dropdown',
    name: 'SortDropdown',
    component: TestSortDropdown
  },
  {
    path: '/sort-list',
    name: 'SortList',
    component: TestSortList
  },
  {
    path: '/sort-picker-list',
    name: 'SortPickerList',
    component: TestSortPickerList
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
