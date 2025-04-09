import type { NextQueriesXStoreModule } from '../types'

/**
 * Default implementation for the {@link NextQueriesGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the next
 * queries module.
 * @param state.config - config state.
 * @param state.params - params state.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * search module.
 * @param getters.query - Query getter.
 *
 * @returns The next queries request to fetch data from the API.
 *
 * @public
 */
export const request: NextQueriesXStoreModule['getters']['request'] = (
  { config, params },
  { query },
) => {
  return query
    ? {
        query,
        rows: config.maxItemsToRequest,
        start: 0,
        extraParams: params,
      }
    : null
}
