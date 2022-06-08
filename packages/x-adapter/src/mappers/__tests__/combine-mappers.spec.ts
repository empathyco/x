import { DeepPartial } from '@empathyco/x-utils';
import { Mapper } from '../../types/mapper.types';
import { combineMappers } from '../combine-mappers';

describe('combineMappers tests', () => {
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
    const combinedMappers = combineMappers<TestFrom, TestTo>(testMapper);
    expect(combinedMappers({ query: 'patata', count: 0, extra: 'croqueta' }, {})).toEqual({
      q: 'patata',
      c: 0
    });
  });

  it('combines multiple mappers', () => {
    const combinedMappers = combineMappers<TestFrom, TestTo>(testMapper, extraMapper);
    expect(combinedMappers({ query: 'patata', count: 0, extra: 'croqueta' }, {})).toEqual({
      q: 'patata',
      c: 0,
      e: 'croqueta'
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
