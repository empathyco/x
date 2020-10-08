import { Suggestion } from '@empathy/search-types';
import { GettersClass } from '../../../../store/getters.types';
import { isArrayEmpty } from '../../../../utils/array';
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
    return query
      ? suggestions.filter(
          this.isInQuerySuggestions(normalizeString(query), config.hideIfEqualsQuery)
        )
      : suggestions;
  }

  /**
   * Creates a function to check in the suggestion queries array the items that match
   * the current query.
   *
   * @param normalizedQuery - The normalized query for search into the array.
   * @param hideIfEqualsQuery - If `true`, removes items that are exactly like the current query.
   * @returns A filter function for searching into the array of suggestion queries with the provided
   * params.
   * @internal
   */
  protected isInQuerySuggestions(
    normalizedQuery: string,
    hideIfEqualsQuery: boolean
  ): (suggestion: Suggestion) => boolean {
    return (suggestion: Suggestion) => {
      if (!hideIfEqualsQuery) {
        return true;
      }

      const normalizedSuggestionQuery = normalizeString(suggestion.query);
      return normalizedSuggestionQuery !== normalizedQuery || !isArrayEmpty(suggestion.facets);
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
export const querySuggestions = querySuggestionsGetter.querySuggestions.bind(
  querySuggestionsGetter
);
