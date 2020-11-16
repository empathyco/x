import { HierarchicalFilter, SimpleFilter } from '@empathy/search-types';

/**
 * Creates {@link @empathy/search-types#SimpleFilter | SimpleFilter} stub.
 *
 * @param filter - A partial filter to override certain properties. Useful for testing.
 * @returns A Simple filter.
 *
 * @internal
 */
export function getSimpleFilterStub(filter: Partial<SimpleFilter> = {}): SimpleFilter {
  return Object.assign<SimpleFilter, Partial<SimpleFilter>>(
    {
      facetId: 'category',
      id: 'category:test',
      modelName: 'SimpleFilter',
      selected: false,
      callbackInfo: {},
      label: 'Test',
      value: 'category:test',
      totalResults: 0
    },
    filter
  );
}

/**
 * Creates {@link @empathy/search-types#HierarchicalFilter | HierarchicalFilter} stub.
 *
 * @param filter - A partial filter to override certain properties. Useful for testing.
 * @returns A Hierarchical filter.
 *
 * @internal
 */
export function getHierarchicalFilterStub(
  filter: Partial<HierarchicalFilter> = {}
): HierarchicalFilter {
  return Object.assign<HierarchicalFilter, Partial<HierarchicalFilter>>(
    {
      facetId: 'category',
      id: 'category:test',
      modelName: 'HierarchicalFilter',
      parentId: null,
      selected: false,
      callbackInfo: {},
      label: 'Test',
      value: 'category:test',
      totalResults: 0,
      children: []
    },
    filter
  );
}
