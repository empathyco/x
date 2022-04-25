import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import {
  EditableNumberRangeFacet,
  FacetModelName,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  NumberRangeFilter,
  SimpleFacet,
  SimpleFilter
} from '@empathyco/x-types';
import { PlatformFacet, PlatformFacetFilter, PlatformHierarchicalFilter } from '../types';

export const numberFilterSchema: Schema<PlatformFacetFilter, NumberRangeFilter> = {
  id: 'filter',
  selected: () => false,
  label: 'value',
  modelName: () => 'NumberRangeFilter',
  facetId: 'id',
  range: {
    min: ({ value }) => Number(value.split('-')[0]),
    max: ({ value }) => Number(value.split('-')[1])
  }
};

export const numberFilterMutableSchema = createMutableSchema(numberFilterSchema);

export const simpleFilterSchema: Schema<PlatformFacetFilter, SimpleFilter> = {
  facetId: 'filter',
  label: 'value',
  id: 'filter',
  selected: () => false,
  modelName: () => 'SimpleFilter'
};

export const simpleMutableFilterSchema = createMutableSchema(simpleFilterSchema);

export const facetSchema: Schema<
  PlatformFacet,
  HierarchicalFacet | NumberRangeFacet | SimpleFacet | EditableNumberRangeFacet
> = {
  id: 'facet',
  modelName: ({ facet }) => getFacetType(facet) as any,
  filters: {
    $path: 'values',
    $subSchema: ({ facet }) => getFilterSchemaFromFacetType(facet),
    $context: {
      parentId: 'facet'
    }
  },
  label: 'facet'
};

export const hierarchicalFilterSchema: Schema<PlatformHierarchicalFilter, HierarchicalFilter> = {
  facetId: 'filter',
  label: 'value',
  parentId: (_, $context) => $context?.parentId as string,
  selected: () => false,
  id: 'filter',
  modelName: () => 'HierarchicalFilter',
  children: {
    $path: 'children',
    $subSchema: facetSchema as any
  }
};

export const hierarchicalFilterMutableSchema = createMutableSchema(hierarchicalFilterSchema);

export const facetMutableSchema = createMutableSchema(facetSchema);

/**
 * Resolves the proper facet model name.
 *
 * @param facet - The facet to resolve the model name.
 * @returns The facet's model name.
 */
function getFacetType(facet: string): FacetModelName {
  const name = facet.split('_')[0];
  const hierarchicalFacet = ['categoryPaths'];
  const numberRangeFacet = ['price'];
  if (hierarchicalFacet.includes(name)) {
    return 'HierarchicalFacet';
  }
  if (numberRangeFacet.includes(name)) {
    return 'NumberRangeFacet';
  }
  return 'SimpleFacet';
}

/**
 * Returns the proper schema to apply to the given facet.
 *
 * @param facet - The facet to resolve the schema to apply.
 * @returns The schema to apply.
 */
function getFilterSchemaFromFacetType(facet: string): Schema {
  const name = facet.split('_')[0];
  const hierarchicalFacet = ['categoryPaths'];
  const numberRangeFacet = ['price'];
  if (hierarchicalFacet.includes(name)) {
    return hierarchicalFilterMutableSchema;
  }
  if (numberRangeFacet.includes(name)) {
    return numberFilterMutableSchema;
  }
  return simpleMutableFilterSchema;
}
