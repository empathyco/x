import type { Filter } from '@empathyco/x-types'
import { isHierarchicalFilter } from '@empathyco/x-types'
import { reduce } from '@empathyco/x-utils'

/**
 * Converts the filters to the shape the Platform's API is expecting.
 *
 * @param filters - The filters from our internal request.
 * @param filters.filters - The filters from our internal request.
 * @example
 * ```ts
 * const filters = {
 *     offer: [
 *     {
 *       facetId: 'offer',
 *       modelName: 'SimpleFilter',
 *       id: 'price:[0 TO 10]',
 *       selected: true,
 *       label: 'In Offer'
 *     } as SimpleFilter
 *   ],
 *     categoryPaths: [
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
 *     }]
 * };
 *
 * const mappedFilters = mapFilters({ filters });
 * // mappedFilters is [
 * //      'price:[0 TO 10]',
 * //        'categoryIds:ffc61e1e9__be257cb26',
 * //        'categoryIds:ffc61e1e9__fa5ef54f2'
 * //      ];
 *
 * ```
 * @returns The filters ready for the API.
 */
export function mapFilters(filters: Record<string, Filter[]>): string[] {
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
