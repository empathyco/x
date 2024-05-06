import { Facet, Filter } from '@empathyco/x-types';
import { computed, ComputedRef } from 'vue';
import { useGetter } from '../../../composables/use-getter';
import { isArrayEmpty } from '../../../utils/array';
import { FiltersByFacet } from '../store/types';

/**
 * Composable to share Facets logic.
 *
 * @param params - Composable params.
 * @returns Composable.
 *
 * @public
 */
export function useFacets({
  facetsIds,
  alwaysVisible = false
}: {
  /** Array of facets ids used to get the selected filters for those facets. */
  facetsIds?: Array<Facet['id']>;
  /** Flag to render the component even if there are no filters selected. */
  alwaysVisible?: boolean;
}) {
  const { selectedFiltersByFacet, selectedFilters: selectedFiltersGetter } = useGetter('facets', [
    'selectedFiltersByFacet',
    'selectedFilters'
  ]) as {
    /** Dictionary of filters {@link FiltersByFacet} filtered by facet id. */
    selectedFiltersByFacet: ComputedRef<FiltersByFacet>;
    /** Get the selected filters from store. */
    selectedFilters: ComputedRef<Filter[]>;
  };

  /**
   * Get selected filters.
   * If there are facets ids, get selected filters whose facet id match with some of facets ids.
   * If there aren't facets ids, get selected filters.
   *
   * @returns Array of selected filters depends on there are facets ids or not.
   */
  const selectedFilters = computed<Filter[]>(() => {
    if (facetsIds) {
      return (facetsIds as string[]).reduce(
        (selectedFilters, facetId) => [
          ...selectedFilters,
          ...selectedFiltersByFacet.value[facetId]
        ],
        [] as Filter[]
      );
    }

    return selectedFiltersGetter.value;
  });

  /**
   * Check if there are selected filters.
   *
   * @returns True or false depends on if there are selected filters.
   */
  const hasSelectedFilters = computed<boolean>(() => !isArrayEmpty(selectedFilters.value));

  /**
   * Flag representing if the component should be visible/rendered or not.
   *
   * @returns True whenever alwaysVisible is true or has selected filters. False
   * otherwise.
   */
  const isVisible = computed<boolean>(() => alwaysVisible || hasSelectedFilters.value);

  return {
    selectedFiltersByFacet,
    selectedFilters,
    hasSelectedFilters,
    isVisible
  };
}
