import type { AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins'

/**
 * Default implementation for the {@link AiActions.fetchAiSuggestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param queries - The queries suggested.
 * @returns The AI response.
 *
 * @public
 */
export const fetchAiSuggestionsSearch: AiXStoreModule['actions']['fetchAiSuggestionsSearch'] =
  async ({ getters }, queries) => {
    if (!queries) {
      return null
    }
    return XPlugin.adapter.aiSuggestionsSearch({
      queries,
      extraParams: getters.request?.extraParams,
    })
  }
