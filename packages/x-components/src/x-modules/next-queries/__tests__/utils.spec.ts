import { NextQuery } from '@empathyco/x-types-old';
import { areNextQueriesDifferent } from '../utils';

describe('testing areNextQueriesDifferent', () => {
  it('returns true when the array length is different', () => {
    const a = createNextQueriesFromQueries('milk', 'butter');
    const b = createNextQueriesFromQueries('milk', 'butter', 'coffee');

    expect(areNextQueriesDifferent(a, b)).toBe(true);
  });

  it('returns true when one next-queries has a different query', () => {
    const a = createNextQueriesFromQueries('milk', 'butter');
    const b = createNextQueriesFromQueries('milk', 'coffee');

    expect(areNextQueriesDifferent(a, b)).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('returns true when all of the next-queries have the same query but are in different position', () => {
    const a = createNextQueriesFromQueries('milk', 'butter');
    const b = createNextQueriesFromQueries('butter', 'milk');

    expect(areNextQueriesDifferent(a, b)).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('returns false when all of the next-queries have the same query and are in the same position', () => {
    const a = createNextQueriesFromQueries('milk', 'butter');
    const b = createNextQueriesFromQueries('milk', 'butter');

    expect(areNextQueriesDifferent(a, b)).toBe(false);
  });

  function createNextQueriesFromQueries(...queries: string[]): NextQuery[] {
    return queries.map(query => ({
      modelName: 'NextQuery',
      facets: [],
      results: [],
      totalResults: 0,
      query
    }));
  }
});
