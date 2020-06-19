import { IdentifierResultsXStoreModule } from '../types';
/**
 * Default implementation for the {@link IdentifierResultsGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the identifier
 * results module.
 * @returns The identifier results request to fetch data from the API.
 *
 * @public
 */
export const request: IdentifierResultsXStoreModule['getters']['request'] = ({ query, config }) => {
  return query.trim()
    ? {
        query,
        rows: config.maxItemsToRequest,
        start: 0,
        origin: 'default' //TODO Remove origin parameter when added as optional in search adapter.
      }
    : null;
};
