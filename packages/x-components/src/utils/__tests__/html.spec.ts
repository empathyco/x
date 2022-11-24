import { isElementEqualOrContained } from '../html';

describe(`testing ${isElementEqualOrContained.name} utility method`, () => {
  it('returns `true` the two elements are the same', () => {
    const element = document.createElement('div');

    expect(isElementEqualOrContained(element, element)).toBe(true);
  });

  it('returns `true` the first element contains the second one', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    const c = document.createElement('div');
    a.appendChild(b);
    b.appendChild(c);

    expect(isElementEqualOrContained(a, c)).toBe(true);
  });

  it('returns `false` when the two elements have no relation', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');

    expect(isElementEqualOrContained(a, b)).toBe(false);
  });
});
