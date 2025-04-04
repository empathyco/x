import type { NumberRangeFilter } from '@empathyco/x-types';
import type { PlatformFilter } from '../../../../types';
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { numberFilterSchema } from '../number-filter.schema';

const createFilter = (value: string): PlatformFilter => {
  return {
    id: 'id-irrelevant',
    value,
    count: 10,
    filter: 'price:filter-irrelevant'
  };
};

describe('tests', () => {
  const mapper = schemaMapperFactory<PlatformFilter, NumberRangeFilter>(numberFilterSchema);
  it('should map to null the min value', () => {
    const filter = mapper(createFilter('*-10'), {});
    expect(filter.range).toEqual({ min: null, max: 10 });
  });

  it('should map to null the max value', () => {
    const filter = mapper(createFilter('10-*'), {});
    expect(filter.range).toEqual({ min: 10, max: null });
  });

  it('should map to null the min value even if the max value is 0', () => {
    const filter = mapper(createFilter('*-0'), {});
    expect(filter.range).toEqual({ min: null, max: 0 });
  });

  it('should map to null the max value even if the min value is 0', () => {
    const filter = mapper(createFilter('0-*'), {});
    expect(filter.range).toEqual({ min: 0, max: null });
  });

  it('should map the right values to min and max', () => {
    const filter = mapper(createFilter('10-20'), {});
    expect(filter.range).toEqual({ min: 10, max: 20 });
  });
});
