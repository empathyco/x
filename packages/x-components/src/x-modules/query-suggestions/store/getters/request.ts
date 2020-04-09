import { QuerySuggestionsXStoreModule } from '../types';
/**
 * Default implementation for the {@link QuerySuggestionsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the query
 * suggestions module.
 * @returns The query suggestions request to fetch data from the API.
 */
export const request: QuerySuggestionsXStoreModule['getters']['request'] = ({ query, config }) => {
  return query
    ? {
        query: query,
        rows: config.maxItemsToRequest,
        start: 0
      }
    : null;
};
