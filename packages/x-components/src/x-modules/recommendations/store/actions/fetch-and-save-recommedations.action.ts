import { RecommendationsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RecommendationsActions.fetchAndSaveRecommendations}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @returns Promise.
 */
//eslint-disable-next-line max-len
export const fetchAndSaveRecommendations: RecommendationsXStoreModule['actions']['fetchAndSaveRecommendations'] = ({
  dispatch,
  commit
}) =>
  dispatch('fetchRecommendations').then(recommendations =>
    commit('setRecommendations', recommendations)
  );
