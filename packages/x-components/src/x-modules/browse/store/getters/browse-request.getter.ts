import type { BrowseXStoreModule } from '../types'
import { isFacetFilter } from '@empathyco/x-types'
import { groupItemsBy } from '../../../../utils/index'

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
