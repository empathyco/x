import { Result } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/fetch-and-save-action.helpers';
import { RecommendationsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  RecommendationsActionContext,
  Result[]
>({
  fetch({ dispatch }) {
    return dispatch('fetchRecommendations');
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
