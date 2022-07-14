import { XPlugin } from '../../../../plugins/x-plugin';
import { IdentifierResultsXStoreModule } from '../types';

/**
 * Default implementation for the {@link IdentifierResultsActions.fetchIdentifierResults}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The identifier results request to make.
 * @returns A Promise of Result[] that resolves when it fetches identifier results or empty array
 * if the request was not made.
 *
 * @public
 */
//eslint-disable-next-line max-len
export const fetchIdentifierResults: IdentifierResultsXStoreModule['actions']['fetchIdentifierResults'] =
  (_context, request) => {
    return request ? XPlugin.adapter.identifierResults(request).then(({ results }) => results) : [];
  };
