import { Facet as FacetNext } from '@empathyco/x-types-next';
import { createStoreEmitters } from '../../../store';
import { searchXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the search module.
 *
 * @internal
 */
export const searchEmitters = createStoreEmitters(searchXStoreModule, {
  BackendFacetsChanged: state => state.facets,
  //TODO remove when facets refactor is done
  FacetsChangedNext: state => state.facets as unknown as FacetNext[],
  PageChanged: state => state.page,
  ResultsChanged: state => state.results,
  SearchRequestChanged: (_, getters) => getters.request,
  SpellcheckChanged: state => state.spellcheckedQuery,
  SortChanged: state => state.sort
});
