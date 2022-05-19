import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the search
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * search module.
 * @returns The search request to fetch data from the API.
 *
 * @public
 */
export const request: SearchXStoreModule['getters']['request'] = (
  { page, params, selectedFilters: filters, sort },
  { query }
) => {
  return query
    ? {
        query,
        sort,
        page,
        filters,
        extraParams: params
      }
    : null;
};
