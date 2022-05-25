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
import { numberFilterMutableSchema, simpleMutableFilterSchema } from './filters';

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
    $subSchema: ({ facet }) => getFacetConfig(facet).getSchema() as any,
    $context: {
      parentId: 'facet',
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
  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  parentId: (_, $context) => ($context?.isChild ? ($context?.parentId as string) : null),
  selected: () => false,
  modelName: () => 'HierarchicalFilter',
  children: {
    $path: 'children',
    $subSchema: facetMutableSchema as any,
    $context: {
      // TODO EX-6217 Replace with boolean value instead of using the value of `filter`
      isChild: 'filter'
    }
  }
};

export const hierarchicalFilterMutableSchema = createMutableSchema(hierarchicalFilterSchema);

export const facetsConfig: FacetsConfig = {
  categoryPaths: {
    modelName: 'HierarchicalFacet',
    getSchema: () => hierarchicalFilterMutableSchema
  },
  price: {
    modelName: 'NumberRangeFacet',
    getSchema: () => numberFilterMutableSchema
  },
  default: {
    modelName: 'SimpleFacet',
    getSchema: () => simpleMutableFilterSchema
  }
};
