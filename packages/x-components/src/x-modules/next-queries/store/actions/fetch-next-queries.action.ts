import { XPlugin } from '../../../../plugins/x-plugin';
import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesActions.fetchNextQueries}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The next queries request to make.
 * @returns A Promise of NextQuery[] that resolves when it fetches next queries or `null`
 * if the request was not made.
 *
 * @public
 */
export const fetchNextQueries: NextQueriesXStoreModule['actions']['fetchNextQueries'] = (
  _,
  request
) => {
  return request
    ? XPlugin.adapter.getNextQueries(request).then(({ nextQueries }) => nextQueries)
    : null;
};
