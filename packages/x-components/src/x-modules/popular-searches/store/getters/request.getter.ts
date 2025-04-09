import type { PopularSearchesXStoreModule } from '../types'

/**
 * Default implementation for the {@link PopularSearchesGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the popular
 * searches module.
 * @param state.config - config state.
 * @param state.params - params state.
 *
 * @returns The popular searches request to fetch data from the API.
 *
 * @public
 */
export const request: PopularSearchesXStoreModule['getters']['request'] = ({ config, params }) => {
  return {
    rows: config.maxItemsToRequest,
    start: 0,
    extraParams: params,
  }
}
