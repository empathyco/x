import { createRouter, createWebHistory } from 'vue-router';
import TestScroll from './components/scroll/test-scroll.vue';
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
  },
  {
    path: '/scroll',
    name: 'Scroll',
    component: TestScroll
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
