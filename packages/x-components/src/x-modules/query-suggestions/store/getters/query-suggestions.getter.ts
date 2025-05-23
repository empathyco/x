import type { HistoryQuery, Suggestion } from '@empathyco/x-types'
import type { GettersClass } from '../../../../store/getters.types'
import type { QuerySuggestionsState, QuerySuggestionsXStoreModule } from '../types'
import { normalizeString } from '../../../../utils/normalize'

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
  querySuggestions({
    query,
    suggestions,
    config,
    searchedQueries,
  }: QuerySuggestionsState): Suggestion[] {
    const queriesToFilter = searchedQueries.map((historyQuery: HistoryQuery) => historyQuery.query)
    if (!query || !config.hideIfEqualsQuery) {
      return config.hideSessionQueries
        ? suggestions.filter(({ query }) => !queriesToFilter.includes(query))
        : suggestions
    }
    const filteredSuggestions = suggestions.filter(
      this.isInQuerySuggestions(normalizeString(query)),
    )
    return config.hideSessionQueries
      ? filteredSuggestions.filter(({ query }) => !queriesToFilter.includes(query))
      : filteredSuggestions
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
      const normalizedSuggestionQuery = normalizeString(suggestion.query)
      // TODO Hide the suggestion if it's equals to the query and it does NOT have facets. (EX-3184)
      // The logic is here https://bitbucket.org/colbenson/x-components/pull-requests/432
      // normalizedSuggestionQuery !== normalizedQuery || !isArrayEmpty(suggestion.facets)
      return normalizedSuggestionQuery !== normalizedQuery
    }
  }
}

const querySuggestionsGetter = new QuerySuggestionsGetter()

/**
 * Query Suggestions getter.
 *
 * @public
 */
export const querySuggestions = querySuggestionsGetter.querySuggestions.bind(querySuggestionsGetter)
