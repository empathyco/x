import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the next
 * queries module.
 * @returns The next queries request to fetch data from the API.
 *
 * @public
 */
export const request: NextQueriesXStoreModule['getters']['request'] = ({
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
