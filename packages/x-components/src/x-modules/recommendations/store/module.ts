import type { RecommendationsXStoreModule } from './types'
import { DefaultResultsEnrichmentService } from '../../../services/results-enrichment.service'
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils'
import { setStatus } from '../../../store/utils/status-store.utils'
import {
  cancelFetchAndSaveRecommendationsEnrichment,
  fetchAndSaveRecommendationsEnrichment,
} from './actions/fetch-and-save-recommendations-enrichment.action'
import {
  cancelFetchAndSaveRecommendations,
  fetchAndSaveRecommendations,
} from './actions/fetch-and-save-recommendations.action'
import { fetchRecommendations } from './actions/fetch-recommendations.action'
import { RECOMMENDATIONS_ORIGIN } from './constants'
import { request } from './getters/request.getter'

/**
 * {@link XStoreModule} For the recommendations module.
 *
 * @internal
 */
export const recommendationsXStoreModule: RecommendationsXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 24,
    },
    origin: RECOMMENDATIONS_ORIGIN,
    status: 'initial',
    recommendations: [],
    params: {},
  }),
  getters: {
    request,
  },
  mutations: {
    setRecommendations(state, recommendations) {
      state.recommendations = recommendations
    },
    setStatus,
    setParams(state, params) {
      state.params = params
    },
    updateRecommendation(state, recommendation) {
      const stateRecommendation = state.recommendations.find(
        stateRecommendation => recommendation.id === stateRecommendation.id,
      )
      if (stateRecommendation) {
        Object.assign(stateRecommendation, recommendation)
      }
    },
    updateRecommendationsFromEnrichment(state, enrichmentResults) {
      DefaultResultsEnrichmentService.instance.updateResults(
        state.recommendations,
        enrichmentResults,
      )
    },
    setConfig,
    mergeConfig,
  },
  actions: {
    cancelFetchAndSaveRecommendations,
    cancelFetchAndSaveRecommendationsEnrichment,
    fetchRecommendations,
    fetchAndSaveRecommendations,
    fetchAndSaveRecommendationsEnrichment,
  },
}
