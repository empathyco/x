import { createRouter, createWebHistory } from 'vue-router';
import {
  TestAnimateWidth,
  TestBaseColumnPickerDropdown,
  TestBaseColumnPickerList,
  TestBaseDropdown,
  TestBaseEventButton,
  TestCollapseHeight,
  TestCollapseWidth,
  TestCrossFade,
  TestElementsList,
  TestFacets,
  TestFade,
  TestScroll,
  TestSortDropdown,
  TestSortList,
  TestSortPickerList,
  TestBaseScroll,
  TestSearchBox,
  TestLayoutsComposable
} from './';

const routes = [
  {
    path: '/animate-width',
    name: 'AnimateWidth',
    component: TestAnimateWidth
  },
  {
    path: '/collapse-height',
    name: 'CollapseHeight',
    component: TestCollapseHeight
  },
  {
    path: '/collapse-width',
    name: 'CollapseWidth',
    component: TestCollapseWidth
  },
  {
    path: '/cross-fade',
    name: 'CrossFade',
    component: TestCrossFade
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
    path: '/scroll',
    name: 'Scroll',
    component: TestScroll
  },
  {
    path: '/base-scroll',
    name: 'BaseScroll',
    component: TestBaseScroll
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
  },
  {
    path: '/search-box',
    name: 'SearchBox',
    component: TestSearchBox
  },
  {
    path: '/elements-list',
    name: 'ElementsList',
    component: TestElementsList
  },
  {
    path: '/test-layouts-composable',
    name: 'TestLayoutsComposable',
    component: TestLayoutsComposable
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
