import { SemanticQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link SemanticQueriesGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the semantic
 * queries module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * search module.
 * @returns The semantic queries request to fetch data from the API.
 *
 * @public
 */
export const request: SemanticQueriesXStoreModule['getters']['request'] = (
  { params, totalResults, config: { threshold, maxItemsToRequest } },
  { normalizedQuery }
) => {
  return normalizedQuery && totalResults <= threshold
    ? {
        query: normalizedQuery,
        extraParams: {
          ...params,
          k: maxItemsToRequest
        }
      }
    : null;
};
