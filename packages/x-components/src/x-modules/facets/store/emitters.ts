import { createStoreEmitters } from '../../../store/utils/store-emitters.utils'
import { areFiltersDifferent, areRequestsDifferent } from '../../../utils/filters'
import { isNewQuery } from '../../../utils/is-new-query'
import { facetsXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsEmitters = createStoreEmitters(facetsXStoreModule, {
  SelectedFiltersChanged: {
    selector: (_, getters) => getters.selectedFilters,
    filter: areFiltersDifferent,
    metadata: {
      priority: 12,
    },
  },
  SelectedFiltersForRequestChanged: {
    selector: (_, getters) => getters.selectedFiltersForRequest,
    filter: areFiltersDifferent,
    metadata: {
      priority: 12,
    },
  },
  FacetsQueryChanged: {
    selector: state => state.query,
    filter: isNewQuery,
  },
  FacetsRequestUpdated: {
    selector: (_, getters) => getters.request,
    filter: areRequestsDifferent,
  },
  FacetsChanged: {
    selector: state => state.rawFacets,
    filter(newValue, oldValue): boolean {
      return newValue.length !== 0 || oldValue.length !== 0
    },
  },
})
