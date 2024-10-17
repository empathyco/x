import { RelatedPromptsRequest, RelatedPromptsResponse } from '@empathyco/x-types';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { RelatedPromptsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RelatedPromptsActionContext,
  RelatedPromptsRequest | null,
  RelatedPromptsResponse
>({
  fetch({ dispatch }, request) {
    return request ? dispatch('fetchRelatedPromptsResponse', request) : Promise.resolve(null);
  },
  onSuccess({ commit }, response) {
    commit('setRelatedPromptsProducts', response.relatedPromptsProducts);
  }
});

/**
 * Default implementation for
 * {@link RelatedPromptsActions.fetchAndSaveRelatedPromptsResponse} action.
 */
export const fetchAndSaveRelatedPromptsResponse = fetchAndSave;

/**
 * Default implementation for
 * {@link RelatedPromptsActions.cancelFetchAndSaveRelatedPromptsResponse} action.
 */
export const cancelFetchAndSaveRelatedPromptsResponse = cancelPrevious;
