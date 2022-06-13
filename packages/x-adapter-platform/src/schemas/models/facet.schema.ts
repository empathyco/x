import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import {
  EditableNumberRangeFacet,
  FacetModelName,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  SimpleFacet
} from '@empathyco/x-types';
import { numberFilterMutableSchema } from '../filters/number-filter.schema';
import { simpleMutableFilterSchema } from '../filters/simple-filter.schema';
import { PlatformFacet, PlatformHierarchicalFilter } from '../../types/models/facet.model';

export const facetMutableSchema = createMutableSchema<
  Schema<
    PlatformFacet,
    HierarchicalFacet | NumberRangeFacet | SimpleFacet | EditableNumberRangeFacet
  >
>({
  id: 'facet',
  label: 'facet',
  modelName: ({ facet }) => getFacetType(facet) as any,
  filters: {
    $path: 'values',
    $subSchema: ({ facet }) => getFilterSchemaFromFacetType(facet),
    $context: {
      parentId: 'facet'
    }
  }
});

export const hierarchicalFilterMutableSchema = createMutableSchema<
  Schema<PlatformHierarchicalFilter, HierarchicalFilter>
>({
  facetId: 'filter',
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  parentId: (_, $context) => $context?.parentId as string,
  selected: () => false,
  modelName: () => 'HierarchicalFilter',
  children: {
    $path: 'children',
    $subSchema: facetMutableSchema as any
  }
});

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
  const facetType = getFacetType(facet);
  if (facetType === 'HierarchicalFacet') {
    return hierarchicalFilterMutableSchema;
  }
  if (facetType === 'NumberRangeFacet') {
    return numberFilterMutableSchema;
  }
  return simpleMutableFilterSchema;
}
