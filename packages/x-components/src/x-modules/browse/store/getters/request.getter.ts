import type { BrowseXStoreModule } from '../types'

/**
 * Default implementation for the {@link BrowseGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the browse
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * browse module.
 * @returns The browse request to fetch data from the API.
 * @public
 */
export const request: BrowseXStoreModule['getters']['request'] = ({
  page,
  params,
  selectedFilters: filters,
  sort,
  selectedCategory,
}) => {
  const browseValue = selectedCategory?.browseValue?.trim()
  const browseField = selectedCategory?.browseField?.trim()

  return browseValue && browseField
    ? {
        browseField,
        browseValue,
        sort,
        page,
        filters,
        extraParams: params,
      }
    : null
}
