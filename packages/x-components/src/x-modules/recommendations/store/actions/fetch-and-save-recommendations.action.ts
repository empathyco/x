import type { RecommendationsRequest, Result } from '@empathyco/x-types'

import type { RecommendationsActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RecommendationsActionContext,
  RecommendationsRequest | null,
  Result[]
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchRecommendations', request)
  },
  onSuccess({ commit }, recommendations) {
    commit('setRecommendations', recommendations)
  },
})

/**
 * Default implementation for {@link RecommendationsActions.fetchAndSaveRecommendations}
 * action.
 *
 * @public
 */
export const fetchAndSaveRecommendations = fetchAndSave

/**
 * Default implementation for {@link RecommendationsActions.cancelFetchAndSaveRecommendations}
 * action.
 *
 * @public
 */
export const cancelFetchAndSaveRecommendations = cancelPrevious
