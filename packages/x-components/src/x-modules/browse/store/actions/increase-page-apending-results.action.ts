import type { BrowseXStoreModule } from '../types'

/**
 * Default implementation for the {@link BrowseActions.increasePageAppendingResults}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */

export const increasePageAppendingResults: BrowseXStoreModule['actions']['increasePageAppendingResults'] =
  ({ commit, state }) => {
    const newPage = state.page + 1
    if (newPage >= 1 && state.page * state.config.pageSize < state.totalResults) {
      commit('setPage', newPage)
      commit('setIsAppendResults', true)
    }
  }
