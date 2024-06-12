import { XComponentsAdapter } from '@empathyco/x-types';
import { Component, configureCompat, createApp } from 'vue';
import { createStore } from 'vuex';
import { xPlugin } from '../../x-components/src/plugins/x-plugin';
import { getQuerySuggestionsStub } from '../../x-components/src/__stubs__/query-suggestions-stubs.factory';
import App from './App.vue';
import router from './router';
import {
  facetsXModule,
  nextQueriesXModule,
  queriesPreviewXModule,
  scrollXModule,
  searchXModule,
  semanticQueriesXModule
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
    COMPONENT_V_MODEL: false,
    WATCH_ARRAY: false
  });
}

const adapter = {
  querySuggestions: request =>
    new Promise(resolve => {
      resolve({ suggestions: getQuerySuggestionsStub(request.query, 5) });
    })
} as XComponentsAdapter;

const store = createStore({});

createApp(App as Component)
  .use(router)
  .use(store)
  .use(xPlugin, {
    adapter,
    store,
    __PRIVATE__xModules: {
      facets: facetsXModule,
      nextQueries: nextQueriesXModule,
      scroll: scrollXModule,
      search: searchXModule,
      queriesPreview: queriesPreviewXModule,
      semanticQueries: semanticQueriesXModule
    }
  })
  .mount('#app');
