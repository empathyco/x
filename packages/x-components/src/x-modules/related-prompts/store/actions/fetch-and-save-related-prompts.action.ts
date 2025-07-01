import type { RelatedPrompt, RelatedPromptsRequest } from '@empathyco/x-types'
import type { RelatedPromptsActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'
import { getRelatedPromptsByQuery } from '../utils/related-prompts.utils'

const { fetchAndSave, cancelPrevious } = createFetchAndSaveActions<
  RelatedPromptsActionContext,
  RelatedPromptsRequest | null,
  RelatedPrompt[] | null
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchRelatedPrompts', request)
  },
  onSuccess({ commit, state }, relatedPrompts) {
    if (relatedPrompts) {
      commit('setRelatedPromptsProducts', relatedPrompts)
      commit(
        'setFilteredRelatedPromptsProducts',
        getRelatedPromptsByQuery(relatedPrompts, state.query),
      )
    }
  },
})

/**
 * Default implementation for
 * {@link RelatedPromptsActions.fetchAndSaveRelatedPrompts} action.
 *
 * @public
 */
export const fetchAndSaveRelatedPrompts = fetchAndSave

/**
 * Default implementation for
 * {@link RelatedPromptsActions.cancelFetchAndSaveRelatedPrompts} action.
 *
 * @public
 */
export const cancelFetchAndSaveRelatedPrompts = cancelPrevious
