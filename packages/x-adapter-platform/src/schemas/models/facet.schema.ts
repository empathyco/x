import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import {
  EditableNumberRangeFacet,
  HierarchicalFacet,
  NumberRangeFacet,
  SimpleFacet
} from '@empathyco/x-types';
import { PlatformFacet } from '../../types/models/facet.model';
import { getFacetConfig } from '../facets/utils';
import { FacetsConfig } from '../facets/types';
import { hierarchicalFilterSchema } from './filters/hierarchical-filter.schema';
import { numberFilterSchema } from './filters/number-filter.schema';
import { simpleFilterSchema } from './filters/simple-filter.schema';

export const facetSchema = createMutableSchema<
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

export const facetsConfig: FacetsConfig = {
  categoryPaths: {
    modelName: 'HierarchicalFacet',
    schema: hierarchicalFilterSchema
  },
  price: {
    modelName: 'NumberRangeFacet',
    schema: numberFilterSchema
  },
  default: {
    modelName: 'SimpleFacet',
    schema: simpleFilterSchema
  }
};
