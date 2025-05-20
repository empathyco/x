import type { BrowseXStoreModule } from '../types'

export const increasePage: BrowseXStoreModule['actions']['increasePage'] = ({ state, commit }) => {
  if (state.page * state.config.pageSize < state.totalResults) {
    commit('setPage', state.page + 1)
    commit('setShouldAppendResults', true)
  }
}
