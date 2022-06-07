import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import {
  EditableNumberRangeFacet,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  SimpleFacet
} from '@empathyco/x-types';
import {
  PlatformFacet,
  PlatformHierarchicalFilter
} from '../../../types/responses/models/facet.model';
import { getFacetConfig, getFacetId } from './facets/utils';
import { FacetsConfig } from './facets';
import { numberFilterMutableSchema } from './filters/number-filter.schema';
import { simpleMutableFilterSchema } from './filters/simple-filter.schema';

export const facetSchema: Schema<
  PlatformFacet,
  HierarchicalFacet | NumberRangeFacet | SimpleFacet | EditableNumberRangeFacet
> = {
  id: 'facet',
  label: 'facet',
  modelName: source => {
    return getFacetConfig(source.facet).modelName as any;
  },
  filters: {
    $path: 'values',
    $subSchema: ({ facet }) => getFacetConfig(facet).schema as any,
    $context: {
      facetId: 'facet'
    }
  }
};

export const facetMutableSchema = createMutableSchema(facetSchema);

export const hierarchicalFilterSchema: Schema<PlatformHierarchicalFilter, HierarchicalFilter> = {
  facetId: (_, $context) => getFacetId($context?.facetId as string),
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  parentId: (_, $context) => ($context?.parentId as string) ?? null,
  selected: () => false,
  modelName: () => 'HierarchicalFilter',
  children: {
    $path: 'children',
    $subSchema: facetMutableSchema as any,
    $context: {
      parentId: 'filter'
    }
  }
};

export const hierarchicalFilterMutableSchema = createMutableSchema(hierarchicalFilterSchema);

export const facetsConfig: FacetsConfig = {
  categoryPaths: {
    modelName: 'HierarchicalFacet',
    schema: hierarchicalFilterMutableSchema
  },
  price: {
    modelName: 'NumberRangeFacet',
    schema: numberFilterMutableSchema
  },
  default: {
    modelName: 'SimpleFacet',
    schema: simpleMutableFilterSchema
  }
};
