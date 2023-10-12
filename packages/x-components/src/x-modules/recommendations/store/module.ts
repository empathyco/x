import { setStatus } from '../../../store/utils/status-store.utils';
import { mergeConfig, setConfig } from '../../../store/utils/config-store.utils';
import {
  cancelFetchAndSaveRecommendations,
  fetchAndSaveRecommendations
} from './actions/fetch-and-save-recommendations.action';
import { fetchRecommendations } from './actions/fetch-recommendations.action';
import { RECOMMENDATIONS_ORIGIN } from './constants';
import { request } from './getters/request.getter';
import { RecommendationsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the recommendations module.
 *
 * @internal
 */
export const recommendationsXStoreModule: RecommendationsXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 24
    },
    origin: RECOMMENDATIONS_ORIGIN,
    status: 'initial',
    recommendations: [],
    params: {}
  }),
  getters: {
    request
  },
  mutations: {
    setRecommendations(state, recommendations) {
      state.recommendations = recommendations;
    },
    setStatus,
    setParams(state, params) {
      state.params = params;
    },
    updateRecommendation(state, recommendation) {
      const stateRecommendation = state.recommendations.find(
        stateRecommendation => recommendation.id === stateRecommendation.id
      );
      if (stateRecommendation) {
        Object.assign(stateRecommendation, recommendation);
      }
    },
    setConfig,
    mergeConfig
  },
  actions: {
    cancelFetchAndSaveRecommendations,
    fetchRecommendations,
    fetchAndSaveRecommendations
  }
};
