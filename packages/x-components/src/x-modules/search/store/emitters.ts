import { createStoreEmitters } from '../../../store';
import { searchXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the search module.
 *
 * @internal
 */
export const searchEmitters = createStoreEmitters(searchXStoreModule, {
  ResultsChanged: state => state.results,
  SearchRequestChanged: (_, getters) => getters.request,
  BackendFacetsChanged: state => state.facets,
  SpellcheckChanged: state => state.spellcheckedQuery
});
