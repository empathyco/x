import { TopRecommendationsRequest } from '@empathyco/x-adapter';
import { Result } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { createFetchAndSaveAction } from '../../../../store/utils/fetch-and-save-action.utils';
import { RecommendationsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveAction<
  RecommendationsActionContext,
  TopRecommendationsRequest | null,
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
