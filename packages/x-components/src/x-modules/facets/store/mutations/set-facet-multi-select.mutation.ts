import Vue from 'vue';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsMutations.setFacetMultiSelect}.
 *
 * @param state - The {@link https://vuex.vuejs.org/guide/state.html | state} provided by Vuex.
 * @param facetMultiSelectChange - The facet id and the new multi-select value.
 * @public
 */
export const setFacetMultiSelect: FacetsXStoreModule['mutations']['setFacetMultiSelect'] = (
  state,
  { facetId, multiSelect }
) => {
  Vue.set(state.config.multiSelect, facetId, multiSelect);
};
