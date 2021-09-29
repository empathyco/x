import { XPlugin } from '../../../../plugins';
import { RecommendationsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RecommendationsActions.fetchRecommendations}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The recommendations request to make.
 * @returns A `void` promise that resolves when it fetches recommendations.
 *
 * @public
 */
export const fetchRecommendations: RecommendationsXStoreModule['actions']['fetchRecommendations'] =
  (_, request) => {
    return request
      ? XPlugin.adapter.getTopRecommendations(request).then(({ results }) => results)
      : [];
  };
