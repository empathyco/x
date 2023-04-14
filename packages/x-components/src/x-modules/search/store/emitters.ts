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
  SearchRequestUpdated: (_, getters) => getters.request,
  SearchResponseChanged: {
    selector: (state, getters) => {
      return {
        request: getters.request!,
        status: state.status,
        banners: state.banners,
        facets: state.facets,
        partialResults: state.partialResults,
        promoteds: state.promoteds,
        queryTagging: state.queryTagging,
        redirections: state.redirections,
        results: state.results,
        spellcheck: state.spellcheckedQuery,
        totalResults: state.totalResults
      };
    },
    filter: (newValue, oldValue) => {
      return (
        newValue.status !== oldValue.status && oldValue.status === 'loading' && !!newValue.request
      );
    }
  },
  SearchTaggingChanged: {
    selector: state => state.queryTagging,
    filter: ({ url }) => !isStringEmpty(url)
  },
  SpellcheckChanged: state => state.spellcheckedQuery,
  SortChanged: state => state.sort
});
