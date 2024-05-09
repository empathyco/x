import { XComponentsAdapter } from '@empathyco/x-types';
import { Component, configureCompat, createApp } from 'vue';
import { createStore } from 'vuex';
import { xPlugin } from '../../x-components/src/plugins/x-plugin';
import { facetsXModule } from '../../x-components/src/x-modules/facets/x-module';
import App from './App.vue';
import router from './router';
import { searchXModule } from './x-modules/search/x-module';
import { nextQueriesXModule } from './x-modules/next-queries/x-module';
import { scrollXModule, testFacetsXModule } from './';

// Warnings that cannot be solved in Vue 2 (a.k.a. breaking  changes) are suppressed
const VUE_COMPAT_MODE = Number(import.meta.env.VITE_VUE_COMPAT_MODE);
if (VUE_COMPAT_MODE === 2) {
  configureCompat({
    /**
     * Remove $attrs and $listeners when Vue 3 and `INSTANCE_LISTENERS: false`.
     * Both $attrs and $listeners are inherited (automatically forwarded) to the root component
     * by default:
     * https://vuejs.org/guide/components/attrs#nested-component-inheritance
     * https://github.com/vuejs/core/issues/4566#issuecomment-917997056.
     */
    INSTANCE_LISTENERS: 'suppress-warning',
    RENDER_FUNCTION: false,
    COMPONENT_V_MODEL: false,
    WATCH_ARRAY: false
  });
}

const adapter = {} as XComponentsAdapter;

const store = createStore({});

createApp(App as Component)
  .use(router)
  .use(store)
  .use(xPlugin, {
    adapter,
    store,
    initialXModules: [facetsXModule],
    __PRIVATE__xModules: {
      facets: testFacetsXModule,
      nextQueries: nextQueriesXModule,
      scroll: scrollXModule,
      search: searchXModule
    }
  })
  .mount('#app');
