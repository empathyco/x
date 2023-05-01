import { createMutableSchema } from '@empathyco/x-adapter';
import { NumberRangeFilter } from '@empathyco/x-types';
import { PlatformFilter } from '../../../types/models/facet.model';

/**
 * Default implementation for the NumberFilterSchema.
 *
 * @public
 */
export const numberFilterSchema = createMutableSchema<PlatformFilter, NumberRangeFilter>({
  id: 'filter',
  facetId: (_, $context) => $context?.facetId as string,
  label: 'value',
  totalResults: 'count',
  selected: () => false,
  modelName: () => 'NumberRangeFilter',
  range: {
    min: ({ value }) => {
      const min = Number(value.split('-')[0]);
      return Number.isNaN(min) ? null : min;
    },
    max: ({ value }) => {
      const max = Number(value.split('-')[1]);
      return Number.isNaN(max) ? null : max;
    }
  }
});
