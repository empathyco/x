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
export const request: NextQueriesXStoreModule['getters']['request'] = ({ query, params }) => {
  return query.trim()
    ? {
        query,
        extraParams: params
      }
    : null;
};
