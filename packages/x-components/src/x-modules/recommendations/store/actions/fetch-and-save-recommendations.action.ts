import { Result, RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { RecommendationsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RecommendationsActionContext,
  RecommendationsRequest | null,
  Result[]
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchRecommendations', request);
  },
  onSuccess({ commit }, recommendations) {
    commit('setRecommendations', recommendations);
  }
});

/**
 * Default implementation for {@link RecommendationsActions.fetchAndSaveRecommendations}
 * action.
 *
 * @public
 */
export const fetchAndSaveRecommendations = fetchAndSave;

/**
 * Default implementation for {@link RecommendationsActions.cancelFetchAndSaveRecommendations}
 * action.
 *
 * @public
 */
export const cancelFetchAndSaveRecommendations = cancelPrevious;
