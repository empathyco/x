import type { RelatedPromptsXStoreModule } from '../types'

/**
 * Default implementation setUrlParams.
 *
 * @param context - The context of the actions, provided by Vuex.
 * @param urlParams - List of params from the url.
 * @public
 */
export const setUrlParams: RelatedPromptsXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query, prompt },
) => {
  commit('setQuery', query)
  commit('setSelectedPrompt', prompt)
}
