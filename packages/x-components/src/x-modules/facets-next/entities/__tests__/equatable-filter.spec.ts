import { createNextSimpleFilter } from '../../../../__stubs__/filters-stubs.factory';
import { EquatableFilter } from '../equatable-filter';

describe('testing EquatableFilter', () => {
  it('isEquals returns true if two filters have the same id', () => {
    const filter0 = new EquatableFilter(createNextSimpleFilter('category', 'summer', true));
    const filter1 = new EquatableFilter(createNextSimpleFilter('category', 'summer', false));

    expect(filter0.isEquals(filter1)).toBe(true);
    expect(filter1.isEquals(filter0)).toBe(true);
  });

  it('isEquals returns false if two filters have different id', () => {
    const filter0 = new EquatableFilter(createNextSimpleFilter('category', 'spring', true));
    const filter1 = new EquatableFilter(createNextSimpleFilter('category', 'summer', true));

    expect(filter0.isEquals(filter1)).toBe(false);
    expect(filter1.isEquals(filter0)).toBe(false);
  });
});
