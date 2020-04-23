import { HistoryQuery } from '@empathy/search-types';
import { isArrayEmpty } from '../../../../utils/array';
import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesActions.setQueryFromLastHistoryQuery}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param historyQueries - The current history queries.
 * @public
 */
//eslint-disable-next-line max-len
export const setQueryFromLastHistoryQuery: NextQueriesXStoreModule['actions']['setQueryFromLastHistoryQuery'] = (
  { state, commit },
  historyQueries: HistoryQuery[]
) => {
  if (!isArrayEmpty(historyQueries) && state.config.loadOnInit) {
    commit('setQuery', historyQueries[0].query);
  }
};
