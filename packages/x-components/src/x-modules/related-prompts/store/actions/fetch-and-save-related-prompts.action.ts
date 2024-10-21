import { RelatedPrompt, RelatedPromptsRequest } from '@empathyco/x-types';
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils';
import { RelatedPromptsActionContext } from '../types';

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RelatedPromptsActionContext,
  RelatedPromptsRequest | null,
  RelatedPrompt[] | null
>({
  fetch({ dispatch }, request) {
    return dispatch('fetchRelatedPrompts', request);
  },
  onSuccess({ commit }, relatedPrompts) {
    if (relatedPrompts) {
      commit('setRelatedPromptsProducts', relatedPrompts);
    }
  }
});

/**
 * Default implementation for
 * {@link RelatedPromptsActions.fetchAndSaveRelatedPrompts} action.
 */
export const fetchAndSaveRelatedPrompts = fetchAndSave;

/**
 * Default implementation for
 * {@link RelatedPromptsActions.cancelFetchAndSaveRelatedPrompts} action.
 */
export const cancelFetchAndSaveRelatedPrompts = cancelPrevious;
