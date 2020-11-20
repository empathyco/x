import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsMutations.setFilterSelected}.
 *
 * @param _state - The {@link https://vuex.vuejs.org/guide/state.html | state} provided by Vuex.
 * @param payload - The filter, and its new selected state.
 */
export const setFilterSelected: FacetsXStoreModule['mutations']['setFilterSelected'] = (
  _state,
  { filter, selected }
) => {
  filter.selected = selected;
};
