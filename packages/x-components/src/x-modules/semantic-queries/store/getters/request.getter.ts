import type { SemanticQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link SemanticQueriesGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the semantic
 * queries module.
 * @param state.query - query state.
 * @param state.params - params state.
 * @param state.totalResults - totalResults state.
 * @param state.config - config state.
 * @param state.config.threshold - threshold config state.
 * @param state.config.maxItemsToRequest - maxItemsToRequest config state.
 *
 * @returns The semantic queries request to fetch data from the API.
 *
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
