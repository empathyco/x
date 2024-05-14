import { Component, configureCompat, createApp } from 'vue';
import { createStore } from 'vuex';
import { platformAdapter } from '../../x-adapter-platform/src/platform.adapter';
import { XInstaller } from '../../x-components/src/x-installer/x-installer/x-installer';
import App from './App.vue';
import router from './router';
import {
  facetsXModule,
  nextQueriesXModule,
  popularSearchesXModule,
  queriesPreviewXModule,
  recommendationsXModule,
  scrollXModule,
  searchXModule,
  semanticQueriesXModule,
  identifierResultsXModule
} from './';

// Warnings that cannot be solved in Vue 2 (a.k.a. breaking  changes) are suppressed
const VUE_COMPAT_MODE = Number(import.meta.env.VITE_VUE_COMPAT_MODE);
if (VUE_COMPAT_MODE === 2) {
  configureCompat({
    /**
     * Remove $attrs and $listeners when Vue 3 and `INSTANCE_LISTENERS` and
     * `INSTANCE_ATTRS_CLASS_STYLE`.
     * Both $attrs and $listeners are inherited (automatically forwarded) to the root component
     * by default:
     * https://vuejs.org/guide/components/attrs#nested-component-inheritance
     * https://github.com/vuejs/core/issues/4566#issuecomment-917997056.
     */
    INSTANCE_LISTENERS: 'suppress-warning',
    INSTANCE_ATTRS_CLASS_STYLE: 'suppress-warning',
    RENDER_FUNCTION: false,
    COMPONENT_V_MODEL: false
  });
}

const adapter = platformAdapter;

const store = createStore({});

createApp(App as Component)
  .use(router)
  .use(store)
  .mount('#app');

window.initX = {
  instance: 'empathy',
  lang: 'en'
};

new XInstaller({
  adapter,
  store,
  __PRIVATE__xModules: {
    facets: facetsXModule,
    nextQueries: nextQueriesXModule,
    scroll: scrollXModule,
    search: searchXModule,
    queriesPreview: queriesPreviewXModule,
    semanticQueries: semanticQueriesXModule,
    recommendations: recommendationsXModule,
    identifierResults: identifierResultsXModule,
    popularSearches: popularSearchesXModule
  }
}).init();
