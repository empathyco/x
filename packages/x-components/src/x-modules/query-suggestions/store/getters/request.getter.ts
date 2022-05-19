import { QuerySuggestionsXStoreModule } from '../types';

/**
 * Default implementation for the {@link QuerySuggestionsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the query
 * suggestions module.
 *
 * @returns The query suggestions request to fetch data from the API.
 *
 * @public
 */
export const request: QuerySuggestionsXStoreModule['getters']['request'] = ({
  query,
  config,
  params
}) => {
  return query.trim()
    ? {
        query,
        rows: config.maxItemsToRequest,
        start: 0,
        extraParams: params
      }
    : null;
};
