import { createStoreEmitters } from '../../../store/store.utils';
import { areNextFiltersDifferent } from '../../../utils/filters';
import { isNewQuery } from '../utils';
import { facetsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsEmitters = createStoreEmitters(facetsXStoreModule, {
  SelectedFiltersChanged: {
    selector: (_, getters) => getters.selectedFilters,
    filter: areNextFiltersDifferent
  },
  FacetsQueryChanged: {
    selector: state => state.query,
    filter: isNewQuery
  }
});
