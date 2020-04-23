import { XPlugin } from '../../../../plugins/x-plugin';
import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesActions.getNextQueries}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A Promise of NextQuery[] that resolves when it fetches next queries.
 * @public
 */
export const getNextQueries: NextQueriesXStoreModule['actions']['getNextQueries'] = ({
  getters
}) => {
  return getters.request
    ? XPlugin.adapter.getNextQueries(getters.request).then(({ nextQueries }) => nextQueries)
    : [];
};
