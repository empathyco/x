import { createRouter, createWebHistory } from 'vue-router';
import { TestAnimateWidth, TestBaseDropdown, TestFade, TestScroll } from './';

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
    path: '/scroll',
    name: 'Scroll',
    component: TestScroll
  },
  {
    path: '/base-dropdown',
    name: 'BaseDropdown',
    component: TestBaseDropdown
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
