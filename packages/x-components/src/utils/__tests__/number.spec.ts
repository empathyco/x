import { isInRange } from '../number';

describe('testing isInRange', () => {
  it('returns True when the number is contained in the range', () => {
    expect(isInRange(-5, [-10, 10])).toBe(true);
    expect(isInRange(-10, [-10, 10])).toBe(true);
    expect(isInRange(10, [-10, 10])).toBe(true);
  });

  it('returns False when the number is not contained in the range', () => {
    expect(isInRange(-10.001, [-10, 10])).toBe(false);
    expect(isInRange(10.001, [-10, 10])).toBe(false);
  });
});
