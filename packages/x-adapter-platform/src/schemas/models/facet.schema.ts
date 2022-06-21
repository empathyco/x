import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import {
  EditableNumberRangeFacet,
  HierarchicalFacet,
  HierarchicalFilter,
  NumberRangeFacet,
  SimpleFacet
} from '@empathyco/x-types';
import { numberFilterMutableSchema } from '../filters/number-filter.schema';
import { simpleFilterMutableSchema } from '../filters/simple-filter.schema';
import { PlatformFacet, PlatformHierarchicalFilter } from '../../types/models/facet.model';
import { getFacetConfig } from '../facets/utils';
import { FacetsConfig } from '../facets/types';

export const facetMutableSchema = createMutableSchema<
  Schema<
    PlatformFacet,
    HierarchicalFacet | NumberRangeFacet | SimpleFacet | EditableNumberRangeFacet
  >
>({
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
});

export const hierarchicalFilterMutableSchema = createMutableSchema<
  Schema<PlatformHierarchicalFilter, HierarchicalFilter>
>({
  facetId: (_, $context) => $context?.facetId as string,
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  parentId: (_, $context) => ($context?.parentId as string) ?? null,
  selected: () => false,
  modelName: () => 'HierarchicalFilter',
  children: {
    $path: 'children.values',
    $subSchema: '$self',
    $context: {
      parentId: 'filter'
    }
  }
});

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
    schema: simpleFilterMutableSchema
  }
};
