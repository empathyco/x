import { createRouter, createWebHistory } from 'vue-router';
import { TestAnimateWidth, TestFade } from './';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
