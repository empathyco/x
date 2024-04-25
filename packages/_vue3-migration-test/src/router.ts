import { createRouter, createWebHistory } from 'vue-router';
import {
  TestAnimateWidth,
  TestBaseDropdown,
  TestBaseEventButton,
  TestFade,
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
