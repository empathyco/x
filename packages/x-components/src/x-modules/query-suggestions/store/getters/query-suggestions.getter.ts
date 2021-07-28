import { Suggestion } from '@empathyco/x-types-old';
import { GettersClass } from '../../../../store/getters.types';
import { normalizeString } from '../../../../utils/normalize';
import { QuerySuggestionsState, QuerySuggestionsXStoreModule } from '../types';

/**
 * Class implementation for the {@link QuerySuggestionsGetter.querySuggestions} getter.
 *
 * @public
 */
export class QuerySuggestionsGetter implements GettersClass<QuerySuggestionsXStoreModule> {
  /**
   * Default implementation for the {@link QuerySuggestionsGetter.querySuggestions} getter.
   *
   * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the query
   * suggestions module.
   * @returns The filtered subset of queries, matching with the current query.
   */
  querySuggestions({ query, suggestions, config }: QuerySuggestionsState): Suggestion[] {
    if (!query || !config.hideIfEqualsQuery) {
      return suggestions;
    }
    return suggestions.filter(this.isInQuerySuggestions(normalizeString(query)));
  }

  /**
   * Creates a function to check in the suggestion queries array the items that match
   * the current query.
   *
   * @param normalizedQuery - The normalized query for search into the array.
   * @returns A filter function for searching into the array of suggestion queries with the provided
   * params.
   * @internal
   */
  protected isInQuerySuggestions(normalizedQuery: string): (suggestion: Suggestion) => boolean {
    return (suggestion: Suggestion) => {
      const normalizedSuggestionQuery = normalizeString(suggestion.query);
      // TODO Hide the suggestion if it's equals to the query and it does NOT have facets. (EX-3184)
      // The logic is here https://bitbucket.org/colbenson/x-components/pull-requests/432
      // normalizedSuggestionQuery !== normalizedQuery || !isArrayEmpty(suggestion.facets)
      return normalizedSuggestionQuery !== normalizedQuery;
    };
  }
}

const querySuggestionsGetter = new QuerySuggestionsGetter();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc QuerySuggestionsGetter.querySuggestions}
 *
 * @public
 */
export const querySuggestions =
  querySuggestionsGetter.querySuggestions.bind(querySuggestionsGetter);
