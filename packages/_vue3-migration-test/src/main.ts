import { QuerySuggestionsRequest, XComponentsAdapter } from '@empathyco/x-types';
import { Component, configureCompat, createApp } from 'vue';
import { createStore } from 'vuex';
import { platformAdapter } from '@empathyco/x-adapter-platform';
import { getRelatedTagsStub } from '../../x-components/src/__stubs__/related-tags-stubs.factory';
import { getQuerySuggestionsStub } from '../../x-components/src/__stubs__/query-suggestions-stubs.factory';
import {
  createResultStub,
  getNextQueriesStub,
  getResultsStub
} from '../../x-components/src/__stubs__/index';
import { XInstaller } from '../../x-components/src/x-installer/x-installer/x-installer';
import { baseSnippetConfig } from '../../x-components/src/views/base-config';
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

const adapter = {
  ...platformAdapter,
  relatedTags: () =>
    new Promise(resolve => {
      resolve({ relatedTags: getRelatedTagsStub(10) });
    }),
  querySuggestions: (request: QuerySuggestionsRequest) =>
    new Promise(resolve => {
      resolve({ suggestions: getQuerySuggestionsStub(request.query, 5) });
    }),
  nextQueries: () =>
    new Promise(resolve => {
      resolve({
        nextQueries: [
          ...getNextQueriesStub(),
          {
            facets: [],
            isCurated: false,
            modelName: 'NextQuery',
            query: 'next_query_preview',
            results: getResultsStub(10),
            totalResults: 10
          }
        ]
      });
    }),
  identifierResults: () =>
    new Promise(resolve =>
      resolve({ results: ['123A', '123B', '123C', '123D'].map(id => createResultStub(id)) })
    ),
  tagging: () => new Promise(resolve => resolve())
} as unknown as XComponentsAdapter;

const store = createStore({});

createApp(App as Component)
  .use(router)
  .use(store)
  .mount('#app');

window.initX = baseSnippetConfig;

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
