import { XPlugin } from '../../../../plugins/x-plugin';
import { SemanticQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link SemanticQueriesActions.fetchSemanticQuery}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The semantic query request to make.
 * @returns A Promise of a SearchResponse when it fetches the results.
 *
 * @public
 */
export const fetchSemanticQuery: SemanticQueriesXStoreModule['actions']['fetchSemanticQuery'] = (
  _context,
  request
) => {
  return request?.query ? XPlugin.adapter.semanticQueries(request) : null;
};
