import { createStoreEmitters } from '../../../store/utils/store-emitters.utils';
import { areFiltersDifferent } from '../../../utils/filters';
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
  }
});
