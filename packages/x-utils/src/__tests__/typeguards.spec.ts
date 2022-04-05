import { isArray, isFunction, isObject } from '../typeguards';

describe('typeguards test', () => {
  const str = 'test';
  const num = 0;
  const bool = false;
  // TODO: Migrate noOp function from x-components to x-utils
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const func = (): any => {};
  const arr = [1, 2, 3];
  const obj = {
    a: 1,
    b: {
      c: 'c'
    }
  };
  const nil = null;
  const undef = undefined;

  describe('isArray', () => {
    it('should return true when the passed value is an array', () => {
      expect(isArray(str)).toBe(false);
      expect(isArray(num)).toBe(false);
      expect(isArray(bool)).toBe(false);
      expect(isArray(func)).toBe(false);
      expect(isArray(arr)).toBe(true);
      expect(isArray(obj)).toBe(false);
      expect(isArray(nil)).toBe(false);
      expect(isArray(undef)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true when the passed value is a Function', () => {
      expect(isFunction(str)).toBe(false);
      expect(isFunction(num)).toBe(false);
      expect(isFunction(bool)).toBe(false);
      expect(isFunction(func)).toBe(true);
      expect(isFunction(arr)).toBe(false);
      expect(isFunction(obj)).toBe(false);
      expect(isFunction(nil)).toBe(false);
      expect(isFunction(undef)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true when the passed value is an Object', () => {
      expect(isObject(str)).toBe(false);
      expect(isObject(num)).toBe(false);
      expect(isObject(bool)).toBe(false);
      expect(isObject(func)).toBe(false);
      expect(isObject(arr)).toBe(false);
      expect(isObject(obj)).toBe(true);
      expect(isObject(nil)).toBe(false);
      expect(isObject(undef)).toBe(false);
    });
  });
});
