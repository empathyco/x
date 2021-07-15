import { EmpathyRequestSortMapper } from '../../../mappers/request/params/empathy-request-sort.mapper';

describe('testing EmpathyRequestSortMapper', () => {
  it('returns undefined if the sort is empty or undefined', () => {
    const mapper = new EmpathyRequestSortMapper();

    expect(mapper.map('')).toBeUndefined();
    expect(mapper.map(undefined)).toBeUndefined();
  });

  it('returns the sort value if it is not undefined or empty', () => {
    const mapper = new EmpathyRequestSortMapper();

    expect(mapper.map('price asc')).toBe('price asc');
  });
});
