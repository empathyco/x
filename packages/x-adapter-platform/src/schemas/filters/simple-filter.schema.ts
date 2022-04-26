import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { SimpleFilter } from '@empathyco/x-types';
import { PlatformFacetFilter } from '../../types';

export const simpleFilterSchema: Schema<PlatformFacetFilter, SimpleFilter> = {
  facetId: 'filter',
  label: 'value',
  id: 'filter',
  selected: () => false,
  modelName: () => 'SimpleFilter'
};

export const simpleMutableFilterSchema = createMutableSchema(simpleFilterSchema);
