import type { UrlXStoreModule } from './types'
import { setQuery } from '../../../store/utils/query.utils'
import { urlParams } from './getters/url-params.getter'
import { initialUrlState } from './initial-state'
import { setParams } from './mutations/set-params.mutation'

/**
 * {@link XStoreModule} For the URL module.
 *
 * @internal
 */
export const urlXStoreModule: UrlXStoreModule = {
  state: () => ({
    ...initialUrlState,
    initialExtraParams: {},
  }),
  getters: {
    urlParams,
  },
  mutations: {
    setParams,
    setQuery,
    setRelatedTags(state, relatedTags) {
      state.tag = relatedTags.map(relatedTag => relatedTag.tag)
    },
    setPrompt(state, prompt) {
      state.prompt = prompt
    },
    setFilters(state, newFilters) {
      state.filter = newFilters.map(filter => filter.id as string)
    },
    setPage(state, page) {
      state.page = page
    },
    setSort(state, sort) {
      state.sort = sort
    },
    setInitialExtraParams(state, extraParams) {
      state.initialExtraParams = extraParams
    },
    setScroll(state, scroll) {
      state.scroll = scroll
    },
  },
  actions: {},
}
