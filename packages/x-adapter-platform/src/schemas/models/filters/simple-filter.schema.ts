import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { SimpleFilter } from '@empathyco/x-types';
import { PlatformFilter } from '../../../types/models/facet.model';

export const simpleFilterSchema = createMutableSchema<Schema<PlatformFilter, SimpleFilter>>({
  facetId: (_, $context) => $context?.facetId as string,
  label: 'value',
  id: 'filter',
  totalResults: 'count',
  selected: () => false,
  modelName: () => 'SimpleFilter'
});
