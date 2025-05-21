import type { BrowseXStoreModule } from '../types'
import { isFacetFilter } from '@empathyco/x-types'
import { groupItemsBy } from '../../../../utils/index'

/**
 * Default implementation for the {@link BrowseGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the browse
 * module.
 * @returns The search request to fetch data from the API.
 * @public
 */
export const browseRequest: BrowseXStoreModule['getters']['browseRequest'] = ({
  selectedCategory,
  config,
  page,
  sort,
  selectedFilters,
  params,
}) =>
  selectedCategory
    ? {
        browseField: 'categoryNames',
        browseValue: selectedCategory,
        rows: config.pageSize,
        start: config.pageSize * (page - 1),
        sort: sort || undefined,
        filters: groupItemsBy(selectedFilters, filter =>
          isFacetFilter(filter) ? filter.facetId : '__unknown-facet__',
        ),
        extraParams: params,
      }
    : null
