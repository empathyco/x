import { Module } from 'vuex';
import { RootXStoreState } from './store.types';

/**
 * The type of the x module state has a property for each other sub-module assigned to `null`,
 * so we can avoid re-executing getters every time
 * the `store.registerModule` method is called.
 *
 * @internal
 */
export type XModuleState = { [Key in keyof RootXStoreState['x']]: null };

/**
 * The main module of the X Store. All of the other {@link XModule | XModules} will be
 * registered as a sub-module of this one.
 *
 * @internal
 */
export const RootXStoreModule: Module<XModuleState, any> = {
  state: () => ({
    device: null,
    empathize: null,
    extraParams: null,
    facets: null,
    historyQueries: null,
    identifierResults: null,
    nextQueries: null,
    popularSearches: null,
    queriesPreview: null,
    querySuggestions: null,
    recommendations: null,
    relatedTags: null,
    scroll: null,
    search: null,
    searchBox: null,
    semanticQueries: null,
    tagging: null,
    url: null,
    experienceControls: null,
    test: {}
  }),
  mutations: {
    increment(state) {
      const t0 = performance.now();
      Array.from(Array(210).keys()).forEach(key => {
        console.log(key);
        (state as any).test[key] = { a: key };
      });
      const t1 = performance.now();
      console.log(`Loop of 210 with assignation took ${(t1 - t0) / 1000} seconds.`);
    }
  },
  namespaced: true
};
