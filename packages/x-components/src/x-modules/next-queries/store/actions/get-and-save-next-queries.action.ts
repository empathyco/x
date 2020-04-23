import { HistoryQuery } from '@empathy/search-types';
import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesActions.getAndSaveNextQueries}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when the next queries finishes updating.
 * @public
 */
//eslint-disable-next-line max-len
export const getAndSaveNextQueries: NextQueriesXStoreModule['actions']['getAndSaveNextQueries'] = ({
  dispatch,
  commit,
  state
}) =>
  dispatch('getNextQueries').then(nextQueries => {
    let unSearchedNextQueries = nextQueries;
    if (state.config.hideSessionQueries) {
      const sessionHistoryQueries = state.searchedQueries;
      const sessionQueries = sessionHistoryQueries.map(
        (sessionEntry: HistoryQuery) => sessionEntry.query
      );
      unSearchedNextQueries = nextQueries.filter(nq => !sessionQueries.includes(nq.query));
    }
    commit('setNextQueries', unSearchedNextQueries);
  });
