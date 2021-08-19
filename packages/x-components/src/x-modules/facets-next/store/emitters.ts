import { createStoreEmitters } from '../../../store/store.utils';
import { isNewQuery } from '../utils';
import { DefaultFacetsService } from '../service/facets.service';
import { facetsNextXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the facets module.
 *
 * @internal
 */
export const facetsNextEmitters = createStoreEmitters(facetsNextXStoreModule, {
  SelectedFiltersNextChanged: {
    selector: (_, getters) => getters.selectedFilters,
    filter: DefaultFacetsService.instance.areFiltersDifferent.bind(DefaultFacetsService.instance)
  },
  FacetsQueryChanged: {
    selector: state => state.query,
    filter: isNewQuery
  }
});
