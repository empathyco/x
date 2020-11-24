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
 * Creates a `SimpleFilter` with the provided category and selected values.
 *
 * @param category - The filter category. Used to set the `id`, `value` and `label` fields.
 * @param selected - The selected value. Defaults to `false`.
 * @returns A SimpleFilter initialized with the provided category and selected values.
 */
export function createCategorySimpleFilter(category: string, selected = false): SimpleFilter {
  return {
    facetId: 'category',
    id: `category:${category}`,
    value: `category:${category}`,
    label: category,
    modelName: 'SimpleFilter',
    selected,
    totalResults: 100,
    callbackInfo: {}
  };
}

/**
 * Type function which admits a label, a boolean selected value. The createChildren argument
 * lets you pass another function of the same type in order to create children filters of the same
 * type recursively.
 */
export type CreateHierarchicalFilter = (
  label: string,
  selected: boolean,
  createChildren?: (createChildren: CreateHierarchicalFilter) => HierarchicalFilter[]
) => HierarchicalFilter;

/**
 * Returns a scoped function with a provided facetId and optional parentId that returns a
 * `HierarchicalFilter` with the label and selected values provided by parameters. It also has
 * a third argument createChildren in order to create children filters recursively.
 *
 * @param facetId - Facet id to which the filter belongs.
 * @param parentId - Filter's parent id if exists.
 * @returns A scoped function which is able to create `HierarchicalFilters`.
 */
export function createHierarchicalFilterFactory(
  facetId: string,
  parentId: string | null = null
): CreateHierarchicalFilter {
  return (label, selected, createChildren) => {
    const filterId = `${facetId}:${label.toLowerCase()}`;
    return {
      id: filterId,
      facetId: facetId,
      parentId,
      selected,
      label,
      totalResults: 0,
      callbackInfo: {},
      children: createChildren
        ? createChildren(createHierarchicalFilterFactory(facetId, filterId))
        : [],
      value: label.toLowerCase().replace(/\s+/g, '-'),
      modelName: 'HierarchicalFilter'
    };
  };
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
