import { createStoreEmitters } from '../../../store/store.utils';
import { areNextFiltersDifferent } from '../../../utils/filters';
import { isNewQuery } from '../utils';
import { facetsNextXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsNextEmitters = createStoreEmitters(facetsNextXStoreModule, {
  SelectedFiltersNextChanged: {
    selector: (_, getters) => getters.selectedFilters,
    filter: areNextFiltersDifferent
  },
  FacetsQueryChanged: {
    selector: state => state.query,
    filter: isNewQuery
  }
});
