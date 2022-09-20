import { createStoreEmitters } from '../../../store/utils/store-emitters.utils';
import { areFiltersDifferent } from '../../../utils/filters';
import { isNewQuery } from '../../../utils/is-new-query';
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
