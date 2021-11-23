import { createStoreEmitters } from '../../../store';
import { isStringEmpty } from '../../../utils/string';
import { searchXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the search module.
 *
 * @internal
 */
export const searchEmitters = createStoreEmitters(searchXStoreModule, {
  FacetsChanged: {
    selector: state => state.facets,
    filter(newValue, oldValue): boolean {
      return newValue.length !== 0 || oldValue.length !== 0;
    }
  },
  PageChanged: state => state.page,
  ResultsChanged: state => state.results,
  SearchRequestChanged: (_, getters) => getters.request,
  SearchTaggingChanged: {
    selector: state => state.queryTagging,
    filter: ({ url }) => !isStringEmpty(url)
  },
  SpellcheckChanged: state => state.spellcheckedQuery,
  SortChanged: state => state.sort
});
