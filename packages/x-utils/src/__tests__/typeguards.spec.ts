import { isFunction, isObject, isPath } from '../typeguards';

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
  const arrayOfObj = [obj, { x: 1, y: 5 }];
  const nil = null;
  const undef = undefined;

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

  describe('isPath', () => {
    // eslint-disable-next-line max-len
    it('should return true when the passed path is a valid property path of the passed object', () => {
      expect(isPath(obj, 'a')).toBe(true);
      expect(isPath(obj, 'b.c')).toBe(true);
      expect(isPath(obj, 'b.c.d')).toBe(false);
    });
    // eslint-disable-next-line max-len
    it('should return true when the passed path is a valid property path of the passed array', () => {
      expect(isPath(arrayOfObj, '0.a')).toBe(true);
      expect(isPath(arrayOfObj, '0.b.c')).toBe(true);
      expect(isPath(arrayOfObj, '0.b.c.d')).toBe(false);
      expect(isPath(arrayOfObj, '0.b.c.d')).toBe(false);
      expect(isPath(arrayOfObj, '1.x')).toBe(true);
      expect(isPath(arrayOfObj, '1.y')).toBe(true);
      expect(isPath(arrayOfObj, '1.z')).toBe(true);
    });
  });
});
