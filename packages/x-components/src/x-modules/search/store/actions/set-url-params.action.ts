import type { SearchXStoreModule } from '../types'

/**
 * Default implementation for the {@link SearchActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.commit - commit context.
 * @param context.state - state context.
 * @param urlParams - List of params from the url.
 * @param urlParams.query - query URL params.
 * @param urlParams.page - page URL params.
 * @param urlParams.sort - sort URL params.
 *
 * @public
 */
export const setUrlParams: SearchXStoreModule['actions']['setUrlParams'] = (
  { commit, state },
  { query, page, sort },
) => {
  const currentQuery = state.query

  commit('setQuery', query)
  commit('setPage', !currentQuery || currentQuery === query ? page : 1)
  commit('setSort', sort)
}
