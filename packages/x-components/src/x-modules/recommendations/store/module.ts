import { setStatus } from '../../../store/utils/helpers/status.helpers';
import {
  cancelFetchAndSaveRecommendations,
  fetchAndSaveRecommendations
} from './actions/fetch-and-save-recommendations.action';
import { fetchRecommendations } from './actions/fetch-recommendations.action';
import { RECOMMENDATIONS_ORIGIN } from './constants';
import { request } from './getters/request';
import { RecommendationsXStoreModule } from './types';

/**
 * {@link XStoreModule} For the recommendations module.
 *
 * @internal
 */
export const recommendationsXStoreModule: RecommendationsXStoreModule = {
  state: () => ({
    config: {
      maxItemsToRequest: 5
    },
    origin: RECOMMENDATIONS_ORIGIN,
    status: 'success',
    recommendations: []
  }),
  getters: {
    request
  },
  mutations: {
    setRecommendations(state, recommendations) {
      state.recommendations = recommendations;
    },
    setStatus
  },
  actions: {
    cancelFetchAndSaveRecommendations,
    fetchRecommendations,
    fetchAndSaveRecommendations
  }
};
