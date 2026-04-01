import type { Result } from '@empathyco/x-types'

import type { RecommendationsActionContext } from '../types'
import { DefaultExternalResultEnrichmentService } from '@x/services/external-result-enrichment.service'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RecommendationsActionContext,
  Result[],
  any[]
>({
  async fetch(_, recommendations) {
    return recommendations.length > 0
      ? DefaultExternalResultEnrichmentService.instance.fetchExternalResults(recommendations)
      : []
  },
  onSuccess({ commit }, externalResults) {
    commit('updateRecommendationsFromEnrichment', externalResults)
  },
})

/**
 * Default implementation for {@link RecommendationsActions.fetchAndSaveRecommendationsEnrichment}
 * action.
 *
 * @public
 */
export const fetchAndSaveRecommendationsEnrichment = fetchAndSave

/**
 * Default implementation for {@link RecommendationsActions.cancelFetchAndSaveRecommendationsEnrichment}
 * action.
 *
 * @public
 */
export const cancelFetchAndSaveRecommendationsEnrichment = cancelPrevious
