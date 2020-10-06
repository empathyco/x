import { isStringEmpty } from '../string';

describe(`testing ${isStringEmpty.name} utility method`, () => {
  it('returns `true` when the string is `null`, `undefined` or is an empty string', () => {
    expect(isStringEmpty(undefined)).toEqual(true);
    expect(isStringEmpty(null)).toEqual(true);
    expect(isStringEmpty('')).toEqual(true);
  });

  it('returns `false` when the string length is greater than zero', () => {
    expect(isStringEmpty('a')).toEqual(false);
  });
});
