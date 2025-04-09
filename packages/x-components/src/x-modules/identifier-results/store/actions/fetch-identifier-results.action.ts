import type { IdentifierResultsXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'

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

export const fetchIdentifierResults: IdentifierResultsXStoreModule['actions']['fetchIdentifierResults'] =
  async (_context, request) => {
    return request ? XPlugin.adapter.identifierResults(request).then(({ results }) => results) : []
  }
