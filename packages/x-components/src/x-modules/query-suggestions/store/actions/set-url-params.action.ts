import type { QuerySuggestionsXStoreModule } from '../types'

/**
 * Default implementation for the {@link QuerySuggestionsActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.commit - commit context.
 * @param urlParams - List of params from the url.
 * @param urlParams.query - query urlParams.
 * @public
 */
export const setUrlParams: QuerySuggestionsXStoreModule['actions']['setUrlParams'] = (
  { commit },
  { query },
) => {
  commit('setQuery', query)
}
