import { createRouter, createWebHistory } from 'vue-router';
import { TestAnimateWidth, TestBaseDropdown, TestBaseEventButton, TestFade } from './';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
