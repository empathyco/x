import type { BrowseXStoreModule } from '../types'

/**
 * Default implementation for the {@link BrowseActions.setUrlParams}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param urlParams - List of params from the url.
 * @public
 */
export const setUrlParams: BrowseXStoreModule['actions']['setUrlParams'] = (
  { commit, state },
  { browseValue, browseField, page, sort },
) => {
  const currentCategory = state.selectedCategory

  commit('setSelectedCategory', { browseValue, browseField })
  commit(
    'setPage',
    !currentCategory ||
      (currentCategory.browseValue === browseValue && currentCategory.browseField === browseField)
      ? page
      : 1,
  )
  commit('setSort', browseValue && browseField ? sort : '')
}
