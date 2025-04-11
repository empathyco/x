import type { NextQueriesRequest, NextQuery } from '@empathyco/x-types'

import type { NextQueriesActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  NextQueriesActionContext,
  NextQueriesRequest | null,
  NextQuery[] | null
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchNextQueries', request)
  },
  onSuccess({ commit }, nextQueries) {
    if (nextQueries) {
      commit('setNextQueries', nextQueries)
    }
  },
})

/**
 * Default implementation for {@link NextQueriesActions.fetchAndSaveNextQueries} action.
 *
 * @public
 */
export const fetchAndSaveNextQueries = fetchAndSave

/**
 * Default implementation for {@link NextQueriesActions.cancelFetchAndSaveNextQueries} action.
 *
 * @public
 */
export const cancelFetchAndSaveNextQueries = cancelPrevious
