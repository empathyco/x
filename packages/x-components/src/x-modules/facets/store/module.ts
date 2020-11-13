import { flattenedFilters } from './getters/flattened-filters';
import { selectedFilters } from './getters/selected-filters';
import { setFacets } from './mutations/set-facets.mutation';
import { FacetsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the facets module.
 *
 * @internal
 */
export const facetsXStoreModule: FacetsXStoreModule = {
  state: () => ({
    config: {},
    facets: {}
  }),
  getters: {
    selectedFilters,
    flattenedFilters
  },
  mutations: {
    setFacets
  },
  actions: {}
};
