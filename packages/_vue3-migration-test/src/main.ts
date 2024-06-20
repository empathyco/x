import { QuerySuggestionsRequest, XComponentsAdapter } from '@empathyco/x-types';
import { Component, configureCompat, createApp } from 'vue';
import { createStore } from 'vuex';
import { xPlugin } from '../../x-components/src/plugins/x-plugin';
import { getRelatedTagsStub } from '../../x-components/src/__stubs__/related-tags-stubs.factory';
import { getQuerySuggestionsStub } from '../../x-components/src/__stubs__/query-suggestions-stubs.factory';
import {
  getBannersStub,
  getNextQueriesStub,
  getPromotedsStub,
  getResultsStub
} from '../../x-components/src/__stubs__/index';
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
    COMPONENT_V_MODEL: false,
    WATCH_ARRAY: false,
    /**
     * An attribute with v-bind value `false` will render it as false instead of removing it in Vue 3.
     * To remove the attribute, use `null` or `undefined` instead.
     * The compat behavior is disabled to cover such cases where this behaviour is intended, such as aria-checked:
     * https://v3-migration.vuejs.org/breaking-changes/attribute-coercion.html.
     */
    ATTR_FALSE_VALUE: false
  });
}

const adapter = {
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
  search: () =>
    new Promise(resolve => {
      resolve({
        results: getResultsStub(10),
        totalResults: 50,
        promoteds: getPromotedsStub(),
        banners: getBannersStub()
      });
    })
} as unknown as XComponentsAdapter;

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
      semanticQueries: semanticQueriesXModule,
      recommendations: recommendationsXModule,
      popularSearches: popularSearchesXModule,
      identifierResults: identifierResultsXModule
    }
  })
  .mount('#app');
