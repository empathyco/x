import { NextQueriesRequest } from '@empathyco/x-adapter';
import { NextQuery } from '@empathyco/x-types';

// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/fetch-and-save-action.utils';
import { NextQueriesActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  NextQueriesActionContext,
  NextQueriesRequest,
  NextQuery[] | null
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchNextQueries', request);
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
