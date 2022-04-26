import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { NumberRangeFilter } from '@empathyco/x-types';
import { PlatformFacetFilter } from '../../types';

export const numberFilterSchema: Schema<PlatformFacetFilter, NumberRangeFilter> = {
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
};

export const numberFilterMutableSchema = createMutableSchema(numberFilterSchema);
