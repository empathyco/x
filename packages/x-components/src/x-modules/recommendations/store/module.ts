import { setStatus } from '../../../store/utils/status.helpers';
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
    status: 'success',
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
    }
  },
  actions: {
    cancelFetchAndSaveRecommendations,
    fetchRecommendations,
    fetchAndSaveRecommendations
  }
};
