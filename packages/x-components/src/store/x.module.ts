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
    nextQueries: null,
    popularSearches: null,
    searchBox: null,
    querySuggestions: null,
    historyQueries: null,
    recommendations: null,
    relatedTags: null,
    noSuggestions: null,
    identifierResults: null,
    search: null,
    facets: null,
    facetsNext: null,
    tagging: null
  }),
  namespaced: true
};
