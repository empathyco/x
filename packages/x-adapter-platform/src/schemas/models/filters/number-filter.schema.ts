import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { NumberRangeFilter } from '@empathyco/x-types';
import { PlatformFilter } from '../../../types/models/facet.model';

export const numberFilterSchema = createMutableSchema<Schema<PlatformFilter, NumberRangeFilter>>({
  id: 'filter',
  facetId: (_, $context) => $context?.facetId as string,
  label: 'value',
  totalResults: 'count',
  selected: () => false,
  modelName: () => 'NumberRangeFilter',
  range: {
    min: ({ value }) => Number(value.split('-')[0]),
    max: ({ value }) => Number(value.split('-')[1])
  }
});
