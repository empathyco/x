import type { AiXStoreModule } from '../types'

/**
 * Default implementation setUrlParams.
 *
 * @param context - The context of the actions, provided by Vuex.
 * @param urlParams - List of params from the url.
 * @public
 */
export const setUrlParams: AiXStoreModule['actions']['setUrlParams'] = ({ commit }, { query }) => {
  commit('setQuery', query)
}
