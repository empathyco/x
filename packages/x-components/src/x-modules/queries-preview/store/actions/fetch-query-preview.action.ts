import { XPlugin } from '../../../../plugins/x-plugin';
import { QueriesPreviewXStoreModule } from '../types';

/**
 * Default implementation for the {@link QueriesPreviewActions.fetchQueryPreview}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The query preview request to make.
 * @returns A Promise of a SearchResponse when it fetches the results.
 *
 * @public
 */
export const fetchQueryPreview: QueriesPreviewXStoreModule['actions']['fetchQueryPreview'] = (
  _context,
  request
) => {
  const { query } = request;
  if (!query) {
    return null;
  }
  return XPlugin.adapter.search(request, {
    id: `fetchQueryPreview-${query}`
  });
};
