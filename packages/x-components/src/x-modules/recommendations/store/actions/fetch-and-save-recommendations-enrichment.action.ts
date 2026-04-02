import type { Result } from '@empathyco/x-types'

import type { RecommendationsActionContext } from '../types'
import { DefaultResultsEnrichmentService } from '../../../../services/results-enrichment.service'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RecommendationsActionContext,
  Result[],
  any[]
>({
  async fetch(_, recommendations) {
    return recommendations.length > 0
      ? DefaultResultsEnrichmentService.instance.fetchResults(recommendations)
      : []
  },
  onSuccess({ commit }, enrichmentResults) {
    commit('updateRecommendationsFromEnrichment', enrichmentResults)
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
