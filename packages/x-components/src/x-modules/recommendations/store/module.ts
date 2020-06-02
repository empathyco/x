import { fetchAndSaveRecommendations } from './actions/fetch-and-save-recommedations.action';
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
    recommendations: []
  }),
  getters: {
    request
  },
  mutations: {
    setRecommendations(state, recommendations) {
      state.recommendations = recommendations;
    }
  },
  actions: {
    fetchRecommendations,
    fetchAndSaveRecommendations
  }
};
