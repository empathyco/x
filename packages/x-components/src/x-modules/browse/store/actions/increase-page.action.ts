import type { BrowseXStoreModule } from '../types'

/**
 * Default implementation for the {@link BrowseActions.increasePage}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
export const increasePage: BrowseXStoreModule['actions']['increasePage'] = ({ state, commit }) => {
  if (state.page * state.config.pageSize < state.totalResults) {
    commit('setPage', state.page + 1)
    commit('setShouldAppendResults', true)
  }
}
