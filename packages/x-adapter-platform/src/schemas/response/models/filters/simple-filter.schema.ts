import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { SimpleFilter } from '@empathyco/x-types';
import { PlatformFilter } from '../../../../types/responses/models/facet.model';

export const simpleFilterSchema: Schema<PlatformFilter, SimpleFilter> = {
  facetId: 'filter',
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  selected: () => false,
  modelName: () => 'SimpleFilter'
};

export const simpleMutableFilterSchema = createMutableSchema(simpleFilterSchema);
