import { createStoreEmitters } from '../../../store';
import { areFiltersDifferent, isNewQuery } from '../utils';
import { facetsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsEmitters = createStoreEmitters(facetsXStoreModule, {
  SelectedFiltersChanged: {
    selector: (_, getters) => getters.selectedFilters,
    filter: areFiltersDifferent
  },
  FacetsQueryChanged: {
    selector: state => state.query,
    filter: isNewQuery
  }
});
