import { isArrayEmpty } from '../array';

describe(`testing ${isArrayEmpty.name} utility method`, () => {
  it('returns `true` when the array is `null`, `undefined` or has no elements', () => {
    expect(isArrayEmpty(undefined)).toEqual(true);
    expect(isArrayEmpty(null)).toEqual(true);
    expect(isArrayEmpty([])).toEqual(true);
  });

  it('returns `false` when the array contains at least 1 element', () => {
    expect(isArrayEmpty([null])).toEqual(false);
  });
});
