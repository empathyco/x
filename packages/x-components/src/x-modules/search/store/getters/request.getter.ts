import type { SearchXStoreModule } from '../types'

/**
 * Default implementation for the {@link SearchGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the search
 * module.
 * @param state.page - page state.
 * @param state.params - params state.
 * @param state.selectedFilters - selectedFilters state.
 * @param state.sort - sort state.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * search module.
 * @param getters.query - query getter.
 * @returns The search request to fetch data from the API.
 *
 * @public
 */
export const request: SearchXStoreModule['getters']['request'] = (
  { page, params, selectedFilters: filters, sort },
  { query },
) => {
  return query
    ? {
        query,
        sort,
        page,
        filters,
        extraParams: params,
      }
    : null
}
