import {
  EditableNumberRangeFilter,
  HierarchicalFilter,
  NumberRangeFilter,
  RangeValue,
  SimpleFilter,
  RawFilter
} from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#SimpleFilter | SimpleFilter} stub.
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
      label: 'Test',
      totalResults: 10
    },
    filter
  );
}

/**
 * Creates a {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter} stub.
 *
 * @param filter - A partial filter to override certain properties. Useful for testing.
 * @returns A Number range filter.
 *
 * @internal
 */
export function getNumberRangeFilterStub(
  filter: Partial<NumberRangeFilter> = {}
): NumberRangeFilter {
  return Object.assign<NumberRangeFilter, Partial<NumberRangeFilter>>(
    {
      facetId: 'price_facet',
      id: 'price_facet:0 TO 10',
      modelName: 'NumberRangeFilter',
      selected: false,
      label: 'Test',
      range: {
        min: 1,
        max: 10
      },
      totalResults: 10
    },
    filter
  );
}

/**
 * Creates a {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter} stub.
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
      label: 'Test',
      totalResults: 10,
      children: []
    },
    filter
  );
}

/**
 * Creates a {@link @empathyco/x-types#RawFilter | RawFilter}.
 *
 * @param id - The identifier of the raw filter.
 * @returns A {@link @empathyco/x-types#RawFilter | RawFilter} stub.
 */
export function createRawFilter(id: string): RawFilter {
  return {
    id,
    modelName: 'RawFilter',
    selected: true
  };
}

/**
 * Creates a {@link @empathyco/x-types#SimpleFilter | SimpleFilter}.
 *
 * @param facetId - The facet id this filter belongs to.
 * @param label - The text that this filter should display.
 * @param selected - True when the filter is checked, false otherwise.
 * @param totalResults - Number of results matching the filter.
 * @returns A stub for a {@link @empathyco/x-types#SimpleFilter | SimpleFilter}.
 */
export function createSimpleFilter(
  facetId: string,
  label: string,
  selected = false,
  totalResults = 10
): SimpleFilter {
  return {
    id: `${facetId}:${label}`,
    modelName: 'SimpleFilter',
    facetId,
    label,
    selected,
    totalResults
  };
}

/**
 * Creates a {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}.
 *
 * @param facetId - The facet id this filter belongs to.
 * @param label - The text that this filter should display.
 * @param selected - True when the filter is checked, false otherwise.
 * @param children - A list of ids of child filters.
 * @returns A stub for a {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}.
 */
export function createHierarchicalFilter(
  facetId: string,
  label: string,
  selected = false,
  children: HierarchicalFilter[] = []
): HierarchicalFilter {
  return {
    facetId,
    selected,
    label,
    id: `${facetId}:${label}`,
    modelName: 'HierarchicalFilter',
    parentId: null,
    totalResults: 10,
    children
  };
}

/**
 * Creates a {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter}.
 *
 * @param facetId - The facet id this filter belongs to.
 * @param range - The range that this filter has.
 * @param selected - True if the filter is selected, false otherwise.
 * @returns A stub for a
 * {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter}.
 */
export function createNumberRangeFilter(
  facetId: string,
  range: RangeValue = { min: null, max: null },
  selected = false
): NumberRangeFilter {
  return {
    id: `${facetId}:${range.min ?? '*'}-${range.max ?? '*'}`,
    modelName: 'NumberRangeFilter',
    label: `From ${String(range.min)} to ${String(range.max)}`,
    facetId,
    range,
    selected
  };
}

/**
 * Creates a {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter}.
 *
 * @param facetId - The facet id this filter belongs to.
 * @param range - The range that this filter has.
 * @param selected - The selected value which has priority over the range values.
 * @returns A stub for a
 * {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter}.
 */
export function createEditableNumberRangeFilter(
  facetId: string,
  range: RangeValue = { min: null, max: null },
  selected?: boolean
): EditableNumberRangeFilter {
  return {
    id: `${facetId}:${range.min ?? '*'}-${range.max ?? '*'}`,
    facetId,
    range,
    modelName: 'EditableNumberRangeFilter',
    selected: selected ?? (range.min !== null || range.max !== null)
  };
}

/**
 * Type of a function that creates
 * {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}s. Based on its label,
 * selected value and children.
 */
export type CreateHierarchicalFilter = (
  label: string,
  selected?: boolean,
  createChildren?: (createChildren: CreateHierarchicalFilter) => HierarchicalFilter[]
) => HierarchicalFilter;

/**
 * Creates a factory of
 * {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}s.
 *
 * @remarks the id is created with `<facetId>:<label>`.
 * @param facetId - Facet id to which the filter belongs.
 * @param parentId - Filter's parent id if exists.
 * @returns A scoped function which is able to create `HierarchicalFilters`.
 */
export function createHierarchicalFilterFactory(
  facetId: string,
  parentId: HierarchicalFilter['id'] | null = null
): CreateHierarchicalFilter {
  return (label, selected, createChildren): HierarchicalFilter => {
    const filter = createHierarchicalFilter(facetId, label, selected);
    filter.children = createChildren
      ? createChildren(createHierarchicalFilterFactory(facetId, filter.id))
      : [];
    filter.parentId = parentId;
    return filter;
  };
}
