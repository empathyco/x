import { createMutableSchema } from '@empathyco/x-adapter';
import {
  EditableNumberRangeFacet,
  HierarchicalFacet,
  NumberRangeFacet,
  SimpleFacet
} from '@empathyco/x-types';
import { PlatformFacet } from '../../types/models/facet.model';
import { getFacetConfig } from '../facets/utils';

/**
 * Default implementation for the FacetSchema.
 *
 * @public
 */
export const facetSchema = createMutableSchema<
  PlatformFacet,
  HierarchicalFacet | NumberRangeFacet | SimpleFacet | EditableNumberRangeFacet
>({
  id: 'facet',
  label: 'facet',
  modelName: ({ type }) => getFacetConfig(type).modelName as any,
  filters: {
    $path: 'values',
    $subSchema: ({ type }) => getFacetConfig(type).schema,
    $context: {
      facetId: 'facet'
    }
  }
});
