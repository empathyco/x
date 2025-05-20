import type { BrowseXStoreModule } from '../types'

export const setUrlParams: BrowseXStoreModule['actions']['setUrlParams'] = (
  { commit, state },
  { page, sort },
) => {
  commit('setPage', page ?? 1)
  commit('setPageSize', state.config.pageSize ?? 45)
  commit('setSort', sort)
}
