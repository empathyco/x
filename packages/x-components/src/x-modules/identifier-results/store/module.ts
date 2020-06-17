import { request } from './getters/request';
import { IdentifierResultsXStoreModule } from './types';
/**
 * {@link XStoreModule} For the identifier results module.
 *
 * @internal
 */
export const identifierResultsXStoreModule: IdentifierResultsXStoreModule = {
  state: () => ({
    query: '',
    identifierResults: [],
    config: {
      debounceInMs: 600,
      maxItemsToRequest: 10,
      regex: /.*/
    }
  }),
  getters: {
    request
  },
  mutations: {},
  actions: {}
};
