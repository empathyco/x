import { SearchRequest } from '@empathyco/x-types';
import { NextQueriesXStoreModule } from '../types';
import { XPlugin } from '../../../../plugins/index';

export const fetchNextQueryPreview: NextQueriesXStoreModule['actions']['fetchNextQueryPreview'] = (
  { state },
  query
) => {
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
