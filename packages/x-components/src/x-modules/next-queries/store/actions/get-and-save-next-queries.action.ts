import { NextQueriesXStoreModule } from '../types';

/**
 * Default implementation for the {@link NextQueriesActions.getAndSaveNextQueries}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when the next queries finishes updating.
 *
 * @public
 */
//eslint-disable-next-line max-len
export const getAndSaveNextQueries: NextQueriesXStoreModule['actions']['getAndSaveNextQueries'] = ({
  dispatch,
  commit
}) => dispatch('getNextQueries').then(nextQueries => commit('setNextQueries', nextQueries));
