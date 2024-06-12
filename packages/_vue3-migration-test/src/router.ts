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
  TestBaseModal,
  TestSearchBox,
  TestBaseVariableColumnGrid,
  TestEmpathize,
  TestUseLayouts,
  TestSlidingPanel,
  TestBaseSuggestions,
  TestHighlight,
  TestHistoryQueries,
  TestMyHistory,
  TestBaseResultImages,
  TestBasePanel,
  TestBaseKeyboardNavigation,
  TestPartialResultsList,
  TestBaseEventsModal,
  TestBaseIdModal,
  TestQuerySuggestions
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
    path: '/base-modal',
    name: 'BaseModal',
    component: TestBaseModal
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
    path: '/sliding-panel',
    name: 'SlidingPanel',
    component: TestSlidingPanel
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
    path: '/empathize',
    name: 'Empathize',
    component: TestEmpathize
  },
  {
    path: '/elements-list',
    name: 'ElementsList',
    component: TestElementsList
  },
  {
    path: '/base-variable-column-grid',
    name: 'BaseVariableColumnGrid',
    component: TestBaseVariableColumnGrid
  },
  {
    path: '/test-use-layouts',
    name: 'TestUseLayouts',
    component: TestUseLayouts
  },
  {
    path: '/base-suggestions',
    name: 'BaseSuggestions',
    component: TestBaseSuggestions
  },
  {
    path: '/highlight',
    name: 'Highlight',
    component: TestHighlight
  },
  {
    path: '/history-queries',
    name: 'HistoryQueries',
    component: TestHistoryQueries
  },
  {
    path: '/my-history',
    name: 'MyHistory',
    component: TestMyHistory
  },
  {
    path: '/base-result-images',
    name: 'BaseResultImages',
    component: TestBaseResultImages
  },
  {
    path: '/test-base-panel',
    name: 'TestBasePanel',
    component: TestBasePanel
  },
  {
    path: '/base-keyboard-navigation',
    name: 'TestBaseKeyboardNavigation',
    component: TestBaseKeyboardNavigation
  },
  {
    path: '/partial-results-list',
    name: 'PartialResultsList',
    component: TestPartialResultsList
  },
  {
    path: '/base-events-modal',
    name: 'BaseEventsModal',
    component: TestBaseEventsModal
  },
  {
    path: '/test-base-id-modal',
    name: 'TestBaseIdModal',
    component: TestBaseIdModal
  },
  {
    path: '/query-suggestions',
    name: 'QuerySuggestions',
    component: TestQuerySuggestions
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
