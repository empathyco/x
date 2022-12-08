import { NextQueriesXStoreModule } from '../types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { createOrigin } from '../../../../utils/origin';

/**
 * Default implementation for the {@link NextQueriesActions.fetchNextQueryPreview}.
 *
 * @param state - The state of the store, used to retrieve the rows and the extraParams to be sent
 * in the request.
 * @param query - The next query to send in the request.
 * @param location - The {@link FeatureLocation} to send in the request.
 * @returns A Promise of a SearchResponse when it fetches the results, `null` if the request was
 * not made.
 */
export const fetchNextQueryPreview: NextQueriesXStoreModule['actions']['fetchNextQueryPreview'] = (
  { state },
  { query, location }
) => {
  if (!query) {
    return null;
  }
  const origin = createOrigin({ feature: 'next_query', location }) ?? undefined;

  return XPlugin.adapter.search(
    {
      query,
      rows: state.config.maxPreviewItemsToRequest,
      extraParams: state.params,
      origin
    },
    {
      id: `fetchNextQueryPreview-${query}`
    }
  );
};
