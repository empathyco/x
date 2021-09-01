import { createStoreEmitters } from '../../../store';
import { searchXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the search module.
 *
 * @internal
 */
export const searchEmitters = createStoreEmitters(searchXStoreModule, {
  FacetsChanged: state => state.facets,
  PageChanged: state => state.page,
  ResultsChanged: state => state.results,
  SearchRequestChanged: (_, getters) => getters.request,
  SpellcheckChanged: state => state.spellcheckedQuery,
  SortChanged: state => state.sort
});
