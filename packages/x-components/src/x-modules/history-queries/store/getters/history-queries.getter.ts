import { HistoryQuery } from '@empathy/search-types';
import { GettersClass } from '../../../../store/getters.types';
import { normalizeString } from '../../../../utils/normalize';
import { HistoryQueriesState, HistoryQueriesXStoreModule } from '../types';

/**
 * Class implementation for the {@link HistoryQueriesGetters.historyQueries} getter.
 *
 * @public
 */
export class HistoryQueriesGetter implements GettersClass<HistoryQueriesXStoreModule> {
  /**
   * Default implementation for the {@link HistoryQueriesGetters.historyQueries} getter.
   *
   * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
   * queries module.
   * @returns The filtered subset of queries, matching with the current query.
   */
  historyQueries({ query, historyQueries, config }: HistoryQueriesState): HistoryQuery[] {
    return query
      ? historyQueries.filter(
          this.searchInHistoryQueries(normalizeString(query), config.hideIfEqualsQuery)
        )
      : historyQueries;
  }

  /**
   * Creates a function for searching in the history queries array the items that match the current
   * query.
   *
   * @param normalizedQuery - The normalized query for search into the array.
   * @param hideIfEqualsQuery - If `true`, removes items that are exactly like the current query.
   * @returns A filter function for searching into the array of history queries with the provided
   * params.
   * @internal
   */
  protected searchInHistoryQueries(
    normalizedQuery: string,
    hideIfEqualsQuery: boolean
  ): (historyQuery: HistoryQuery) => boolean {
    return (historyQuery: HistoryQuery) => {
      const normalizedHistoryQuery = normalizeString(historyQuery.query);
      const matchesQuery = normalizedHistoryQuery.includes(normalizedQuery);
      return hideIfEqualsQuery
        ? matchesQuery && normalizedHistoryQuery !== normalizedQuery
        : matchesQuery;
    };
  }
}

const historyQueriesGetter = new HistoryQueriesGetter();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc HistoryQueriesGetter.historyQueries}
 *
 * @public
 */
export const historyQueries = historyQueriesGetter.historyQueries.bind(historyQueriesGetter);
