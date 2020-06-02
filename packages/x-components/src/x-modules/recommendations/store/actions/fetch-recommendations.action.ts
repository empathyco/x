import { XPlugin } from '../../../../plugins';
import { RecommendationsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RecommendationsActions.fetchRecommendations}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns A `void` promise that resolves when it fetches recommendations.
 */
// eslint-disable-next-line max-len
export const fetchRecommendations: RecommendationsXStoreModule['actions']['fetchRecommendations'] = ({
  getters
}) => {
  return getters.request
    ? XPlugin.adapter.getTopRecommendations(getters.request).then(({ results }) => results)
    : [];
};
