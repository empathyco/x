import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { NumberRangeFilter } from '@empathyco/x-types';
import { PlatformFilter } from '../../types/models/facet.model';

export const numberFilterMutableSchema = createMutableSchema<
  Schema<PlatformFilter, NumberRangeFilter>
>({
  id: 'filter',
  facetId: 'id',
  label: 'value',
  totalResults: 'count',
  selected: () => false,
  modelName: () => 'NumberRangeFilter',
  range: {
    min: ({ value }) => Number(value.split('-')[0]),
    max: ({ value }) => Number(value.split('-')[1])
  }
});
