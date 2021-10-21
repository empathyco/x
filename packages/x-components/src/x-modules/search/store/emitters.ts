import { createStoreEmitters } from '../../../store';
import { createArrayComparator } from '../../../utils/array';
import { searchXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the search module.
 *
 * @internal
 */
export const searchEmitters = createStoreEmitters(searchXStoreModule, {
  FacetsChanged: {
    selector: state => state.facets,
    filter: createArrayComparator('id')
  },
  PageChanged: state => state.page,
  ResultsChanged: state => state.results,
  SearchRequestChanged: (_, getters) => getters.request,
  SpellcheckChanged: state => state.spellcheckedQuery,
  SortChanged: state => state.sort
});
