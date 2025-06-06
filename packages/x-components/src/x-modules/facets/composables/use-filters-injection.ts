import type { Filter, HierarchicalFilter } from '@empathyco/x-types'
import type { Ref } from 'vue'
import { isHierarchicalFilter } from '@empathyco/x-types'
import { computed, inject } from 'vue'
import { isArrayEmpty } from '../../../utils/array'

/**
 * Composable to share filters injection logic.
 *
 * @param props - Composable props.
 * @returns An array of filters.
 * @public
 */
export function useFiltersInjection(props: {
  /** The list of filters to be rendered as slots. */
  filters?: Filter[]
  /**
    This prop is used in the `HierarchicalFilter` component and only in that case. It is necessary
   to make the `renderedFilters` to return only the filters of each level of the hierarchy.
   */
  parentId?: Filter['id']
}) {
  /**
   * The injected filters array.
   *
   * @public
   */
  const injectedFilters = inject<Ref<Filter[]> | undefined>('filters', undefined)

  /**
   * An array of filters formed by those that are passed through prop or injected.
   *
   * @returns An array of filters.
   *
   * @internal
   */
  const propOrInjectedFilters = computed((): void | Filter[] => {
    return (
      props.filters ??
      injectedFilters?.value ??
      console.warn('It is necessary to pass a prop or inject the list of filters')
    )
  })

  /**
   * In the case that the filters are {@link @empathyco/x-types#HierarchicalFilter}, this method
   * removes from the filter list passed as a param, the filters that are not part of the level of
   * the hierarchy, depending on the value of the `parentId` prop. In case this prop is undefined,
   * then only the first level of filters hierarchy are returned. In the case the prop `parentId` is
   * defined, then only the filters with the same `parentId` are returned.
   *
   * @param filters - The list of the filters to apply the filter.
   * @returns The list of the filters filtered by parentId.
   * @internal
   */
  const filterByParentId = (filters: Filter[]): Filter[] => {
    if (!isArrayEmpty(filters) && isHierarchicalFilter(filters[0])) {
      return (filters as HierarchicalFilter[]).filter(
        filter => filter.parentId === (props.parentId ?? null),
      )
    } else {
      return filters
    }
  }

  /**
   * The prop or injected filters array, filtered by parentId if they are
   * {@link @empathyco/x-types#HierarchicalFilter}.
   *
   * @returns An array of filters.
   *
   * @internal
   */
  return computed<Filter[]>(() => filterByParentId(propOrInjectedFilters.value as Filter[]))
}
