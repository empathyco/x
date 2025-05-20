import type { BrowseRequest } from '@empathyco/x-types'
import type { PlatformBrowseRequest } from '../../types/requests/browse-request.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { isHierarchicalFilter } from '@empathyco/x-types'
import { reduce } from '@empathyco/x-utils'

/**
 * Default implementation for the SearchRequestSchema.
 *
 * @public
 */
export const browseRequestSchema = createMutableSchema<BrowseRequest, PlatformBrowseRequest>({
  browseField: 'browseField',
  browseValue: 'browseValue',
  extraParams: 'extraParams',
  filter: mapFilters,
  sort: 'sort',
  start: 'start',
  rows: 'rows',
})

/**
 * Converts the filters to the shape the Platform's API is expecting.
 *
 * @param filters - The filters from our internal request.
 * @returns The filters ready for the API.
 */
function mapFilters({ filters }: BrowseRequest): string[] {
  return reduce(
    filters,
    (accumulator, _, filters) => [
      ...accumulator,
      ...filters
        .filter(
          filter =>
            !isHierarchicalFilter(filter) ||
            !filters.some(child => isHierarchicalFilter(child) && child.parentId === filter.id),
        )
        .map(filter => filter.id.toString()),
    ],
    [] as string[],
  )
}
