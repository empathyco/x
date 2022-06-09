import { DeepPartial } from '@empathyco/x-utils';
import { combineMappers } from '../combine-mappers';
import { Mapper } from '../types';

describe('combineMappers util', () => {
  const testMapper: Mapper<TestFrom, DeepPartial<TestTo>> = ({ query, count }) => {
    return {
      q: query,
      c: count
    };
  };
  const extraMapper: Mapper<TestFrom, DeepPartial<TestTo>> = ({ extra }) => {
    return {
      e: extra
    };
  };

  it('combines a single mapper', () => {
    const context = {};
    const combinedMappers = combineMappers<TestFrom, TestTo>(testMapper);
    expect(combinedMappers({ query: 'patata', count: 0, extra: 'croqueta' }, context)).toEqual({
      q: 'patata',
      c: 0
    });
    expect(context).toStrictEqual({ mappedValue: { q: 'patata', c: 0 } });
  });

  it('combines multiple mappers', () => {
    const context = {};
    const combinedMappers = combineMappers<TestFrom, TestTo>(testMapper, extraMapper);
    expect(combinedMappers({ query: 'patata', count: 0, extra: 'croqueta' }, context)).toEqual({
      q: 'patata',
      c: 0,
      e: 'croqueta'
    });
    expect(context).toStrictEqual({
      mappedValue: {
        q: 'patata',
        c: 0,
        e: 'croqueta'
      }
    });
  });
});

interface TestFrom {
  query: string;
  count: number;
  extra: string;
}

interface TestTo {
  q: string;
  c: number;
  e: string;
}
