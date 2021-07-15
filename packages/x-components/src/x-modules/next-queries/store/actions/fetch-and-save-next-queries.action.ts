import { NextQuery } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/helpers/fetch-and-save-action.helpers';
import { NextQueriesActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  NextQueriesActionContext,
  NextQuery[] | null
>({
  fetch({ dispatch }) {
    return dispatch('fetchNextQueries');
  },
  onSuccess({ commit }, nextQueries) {
    if (nextQueries) {
      commit('setNextQueries', nextQueries);
    }
  }
});

/**
 * Default implementation for {@link NextQueriesActions.fetchAndSaveNextQueries} action.
 *
 * @public
 */
export const fetchAndSaveNextQueries = fetchAndSave;

/**
 * Default implementation for {@link NextQueriesActions.cancelFetchAndSaveNextQueries} action.
 *
 * @public
 */
export const cancelFetchAndSaveNextQueries = cancelPrevious;
