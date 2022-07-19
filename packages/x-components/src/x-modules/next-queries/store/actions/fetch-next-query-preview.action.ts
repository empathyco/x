import { SearchRequest } from '@empathyco/x-types';
import { NextQueriesXStoreModule } from '../types';
import { XPlugin } from '../../../../plugins/index';

/**
 * Default implementation for the {@link NextQueriesActions.fetchNextQueryPreview}.
 *
 * @param state - The state of the store, used to retrieve the rows and the extraParams to be sent
 * in the request.
 * @param query - The next query to send in the request.
 * @returns A Promise of a SearchResponse when it fetches the results, `null` if the request was
 * not made.
 */
export const fetchNextQueryPreview: NextQueriesXStoreModule['actions']['fetchNextQueryPreview'] = (
  { state },
  query
) => {
  if (!query) {
    return null;
  }
  const request: SearchRequest = {
    query,
    rows: state.config.resultsPreviewCount,
    extraParams: state.params
  };
  return XPlugin.adapter
    .search(request, {
      id: `fetchNextQueryPreview-${query}`
    })
    .then(searchResponse => searchResponse);
};
