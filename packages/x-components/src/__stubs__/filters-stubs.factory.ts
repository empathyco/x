import {
  HierarchicalFilter,
  SimpleFilter,
  NumberRangeFilter,
  FilterModelName,
  RangeValue,
  EditableNumberRangeFilter,
  Filter
} from '@empathyco/x-types';

/**
 * Creates {@link @empathyco/x-types#SimpleFilter | SimpleFilter} stub.
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
      totalResults: 10
    },
    filter
  );
}

/**
 * Creates {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter} stub.
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
      callbackInfo: {},
      label: 'Test',
      range: {
        min: 1,
        max: 10
      },
      value: '1:10',
      totalResults: 10
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
  return createSimpleFilter('category', category, selected);
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
      totalResults: 10,
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
 * Creates {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter} stub.
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
      totalResults: 10,
      children: []
    },
    filter
  );
}

/**
 * Creates a {@link @empathyco/x-types#Filter | Filter} with the provided `modelName`, `facetId`
 * and `label`.
 *
 * @param modelName - Filter model name.
 * @param facetId - The Facet id.
 * @param label - The filter label. Used to set the `id` (combined with the facetId)
 * and `label` fields.
 *
 * @returns A {@link @empathyco/x-types#Filter | Filter}.
 */
function createFilter<SomeModelName extends FilterModelName>(
  modelName: SomeModelName,
  facetId: string,
  label: string
): Filter & { modelName: SomeModelName } {
  return {
    facetId,
    id: `${facetId}:${label}`,
    label: label,
    modelName: modelName,
    callbackInfo: {}
  };
}

/**
 * Creates a {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter}
 * with the provided `label` and `range`.
 *
 * @param facetId - The facet id.
 * @param label - The filter label. Used to set the `id` (combined with the facetId)
 * and `label` fields.
 * @param range - The range value with min and max set to null by default.
 *
 * @returns An {@link @empathyco/x-types#EditableNumberRangeFilter | EditableNumberRangeFilter}.
 */
export function createEditableNumberRangeFilter(
  facetId: string,
  label: string,
  range: RangeValue = { min: null, max: null }
): EditableNumberRangeFilter {
  return {
    ...(createFilter('EditableNumberRangeFilter', facetId, label) as EditableNumberRangeFilter),
    range
  };
}

/**
 * Creates a {@link @empathyco/x-types#SimpleFilter | SimpleFilter} with the `facetId`, `label`
 * and `selected` value.
 *
 * @param facetId - The facet id.
 * @param label - The filter label. Used to set the `id` (combined with the facetId)
 * and `label` fields.
 * @param selected - The selected value, false by default.
 *
 * @returns An {@link @empathyco/x-types#SimpleFilter | SimpleFilter}.
 */
export function createSimpleFilter(facetId: string, label: string, selected = false): SimpleFilter {
  return {
    ...createFilter('SimpleFilter', facetId, label),
    selected,
    value: `{ "filter: "${label}" }`,
    totalResults: 10
  };
}

/**
 * Creates a {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}.
 *
 * @param facetId - The facet id.
 * @param label - The filter label. Used to set the `id` (combined with the facetId)
 * and `label` fields.
 * @param selected - The selected value, false by default.
 * @returns An {@link @empathyco/x-types#HierarchicalFilter | HierarchicalFilter}.
 */
export function createHierarchicalFilter(
  facetId: string,
  label: string,
  selected = false
): HierarchicalFilter {
  return {
    ...createSimpleFilter(facetId, label, selected),
    modelName: 'HierarchicalFilter',
    parentId: null,
    children: []
  };
}

/**
 *
 * Creates a {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter}.
 *
 * @param facetId - The facet id.
 * @param range - The `min` and `max` values of the filter.
 * @param selected - The selected value, false by default.
 * @returns An {@link @empathyco/x-types#NumberRangeFilter | NumberRangeFilter}.
 */
export function createNumberRangeFilter(
  facetId: string,
  range: RangeValue,
  selected = false
): NumberRangeFilter {
  const min = range.min ?? '*';
  const max = range.max ?? '*';
  return {
    ...createFilter('NumberRangeFilter', facetId, `${min} to ${max}`),
    selected,
    range,
    value: `{ "filter: "${min} to ${max}" }`,
    totalResults: 10
  };
}
