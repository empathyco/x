import type { Filter } from '@empathyco/x-types'
import { isHierarchicalFilter } from '@empathyco/x-types'
import { reduce } from '@empathyco/x-utils'

/**
 * Converts the filters to the shape the Platform's API is expecting.
 *
 * @param filters - The filters from our internal request.
 * @returns The filters ready to be consumed for the API.
 *
 * @example
 * ```ts
 * const filters = {
 *   offer: [
 *     {
 *       facetId: 'offer',
 *       modelName: 'SimpleFilter',
 *       id: 'price:[0 TO 10]',
 *       selected: true,
 *       label: 'In Offer'
 *     } as SimpleFilter
 *   ],
 *   categoryPaths: [
 *     {
 *       facetId: 'categoryPaths',
 *       id: 'categoryIds:ffc61e1e9__be257cb26',
 *       label: 'Fragrance',
 *       modelName: 'HierarchicalFilter',
 *       parentId: 'categoryIds:ffc61e1e9',
 *       selected: true,
 *       totalResults: 1
 *     },
 *     {
 *       facetId: 'categoryPaths',
 *       id: 'categoryIds:ffc61e1e9__fa5ef54f2',
 *       label: 'Fragrance',
 *       modelName: 'HierarchicalFilter',
 *       parentId: 'categoryIds:ffc61e1e9',
 *       selected: true,
 *       totalResults: 1
 *     },
 *     {
 *       children: ['categoryIds:ffc61e1e9__be257cb26', 'categoryIds:ffc61e1e9__fa5ef54f2'],
 *       facetId: 'categoryPaths',
 *       id: 'categoryIds:ffc61e1e9',
 *       label: 'Personal Care',
 *       modelName: 'HierarchicalFilter',
 *       parentId: null,
 *       selected: true,
 *       totalResults: 1
 *     }
 *   ]
 * };
 *
 * const mappedFilters = mapFilters({ filters });
 * mappedFilters is [
 *     'price:[0 TO 10]',
 *     'categoryIds:ffc61e1e9__be257cb26',
 *     'categoryIds:ffc61e1e9__fa5ef54f2'
 * ];
 * ```
 */
export function mapFilters(filters?: Record<string, Filter[]>) {
  return reduce(
    filters,
    (acc, _, filters) => [
      ...acc,
      ...filters
        .filter(
          filter =>
            !isHierarchicalFilter(filter) ||
            !filters.some(child => isHierarchicalFilter(child) && child.parentId === filter.id),
        )
        .map(({ id }) => id.toString()),
    ],
    [] as string[],
  )
}
