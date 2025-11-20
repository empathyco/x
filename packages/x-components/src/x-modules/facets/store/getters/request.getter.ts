import type { FacetsXStoreModule } from '../types'

/**
 * Default implementation for the {@link FacetsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets module.
 * @returns The facets request to fetch data from the API.
 * @public
 */
export const request: FacetsXStoreModule['getters']['request'] = (
  { query, origin, params },
  { selectedFiltersByFacet },
) => {
  return query
    ? {
        query,
        origin: origin === null ? undefined : origin,
        filters: selectedFiltersByFacet,
        extraParams: params,
      }
    : null
}
