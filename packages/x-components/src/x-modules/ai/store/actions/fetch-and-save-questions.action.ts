import type { AiQuestion, AiQuestionsRequest } from '@empathyco/x-types'
import type { AiActionContext } from '../types'
import { createFetchAndSaveActions } from '../../../../store/utils/fetch-and-save-action.utils'

const { fetchAndSave } = createFetchAndSaveActions<
  AiActionContext,
  AiQuestionsRequest | null,
  AiQuestion[] | null
>({
  async fetch({ dispatch }, request) {
    return dispatch('fetchAiQuestions', request)
  },
  onSuccess(_) {},
})

/**
 * Default implementation for
 * {@link AiActions.fetchAndSaveAiQuestions} action.
 *
 * @public
 */
export const fetchAndSaveAiQuestions = fetchAndSave
