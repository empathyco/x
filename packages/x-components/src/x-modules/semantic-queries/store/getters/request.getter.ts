import type { SemanticQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link SemanticQueriesGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the semantic
 * queries module.
 * @returns The semantic queries request to fetch data from the API.
 * @public
 */
export const request: SemanticQueriesXStoreModule['getters']['request'] = ({
  query,
  params,
  totalResults,
  config: { threshold, maxItemsToRequest },
}) => {
  return query && totalResults <= threshold
    ? {
        query,
        extraParams: {
          ...params,
          k: maxItemsToRequest,
        },
      }
    : null
}
