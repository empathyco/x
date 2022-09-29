import {
  cleanEmpty,
  cleanUndefined,
  every,
  flatObject,
  forEach,
  getNewAndUpdatedKeys,
  map,
  reduce,
  rename
} from '../object';
import { Dictionary } from '../types/utils.types';

class Person {
  public constructor(public name: string) {}
}

(Person.prototype as any).inheritedProperty = 'Inherited property';

describe('testing object utils', () => {
  beforeEach(jest.clearAllMocks);

  describe('forEach', () => {
    const forEachCallback = jest.fn();

    it('iterates through object properties', () => {
      const obj = {
        a: 1,
        b: true,
        c: 'hello',
        d: [],
        e: {},
        f: () => {
          return;
        }
      };

      forEach(obj, forEachCallback);

      expectForEachToHaveBeenCalledWithValidParameters(obj);
      expectForEachCallsToHaveValidIndexParameter();
    });

    it('does not iterate through undefined values', () => {
      const obj = { a: 0, b: false, c: '', d: null, e: undefined };

      forEach(obj, forEachCallback);

      const { e, ...objToIterate } = obj;
      expectForEachToHaveBeenCalledWithValidParameters(objToIterate);
      expectForEachCallsToHaveValidIndexParameter();
      expect(forEachCallback).not.toHaveBeenCalledWith('e', obj.e, expect.any(Number));
    });

    it('does not iterate through not owned properties', () => {
      const person = new Person('Eusebio');

      forEach(person, forEachCallback);

      expect(forEachCallback).toHaveBeenCalledTimes(1);
      expect(forEachCallback).toHaveBeenCalledWith('name', person.name, expect.any(Number));
    });

    it('does not iterate if the object is null', () => {
      forEach(null, forEachCallback);

      expect(forEachCallback).not.toHaveBeenCalled();
    });

    it('does not iterate if the object is undefined', () => {
      forEach(undefined, forEachCallback);

      expect(forEachCallback).not.toHaveBeenCalled();
    });

    /**
     * Expects forEach to have been called with valid parameters.
     *
     * @param obj - The object to iterate.
     * @param callback - The callback to apply.
     *
     * @internal
     */
    function expectForEachToHaveBeenCalledWithValidParameters(
      obj: Dictionary,
      callback = forEachCallback
    ): void {
      const objEntries = Object.entries(obj);
      expect(callback).toHaveBeenCalledTimes(objEntries.length);
      expect(objEntries).toHaveLength(objEntries.length);
      objEntries.forEach(([prop, value]) => {
        expect(callback).toHaveBeenCalledWith(prop, value, expect.any(Number));
      });
    }

    /**
     * Expects forEach to have been called with valid index parameter.
     *
     * @param callback - The callback to apply.
     *
     * @internal
     */
    function expectForEachCallsToHaveValidIndexParameter(callback = forEachCallback): void {
      callback.mock.calls
        .map(function selectIndexParameter(call) {
          return call[2];
        }) // 3rd parameter of the forEach call is the index
        .sort(function sortIndexAscending(i1, i2) {
          return i1 - i2;
        }) // Sort them from lower to higher index
        .forEach((forEachIndex, index) => {
          expect(forEachIndex).toBeGreaterThanOrEqual(index);
        });
    }
  });

  describe('reduce', () => {
    const reducer = jest.fn(
      (count: number, _: string, propertyValue) => count + (propertyValue ? 1 : 0)
    ); // Counts truthy properties
    it('iterates through object properties', () => {
      const obj = {
        a: 1,
        b: true,
        c: 'hello',
        d: [],
        e: {},
        f: () => {
          return;
        }
      };

      const result = reduce(obj, reducer, 0);

      expect(result).toEqual(6);
      expectReduceToHaveBeenCalledWithValidParameters(obj);
      expectReduceCallsToHaveValidIndexParameter();
    });

    it('does not iterate through undefined values', () => {
      const obj = { a: 0, b: false, c: '', d: null, e: undefined };

      const result = reduce(obj, reducer, 0);

      const { e, ...objToIterate } = obj;
      expect(result).toEqual(0);
      expectReduceToHaveBeenCalledWithValidParameters(objToIterate);
      expectReduceCallsToHaveValidIndexParameter();
      expect(reducer).not.toHaveBeenCalledWith('e', obj.e, expect.any(Number));
    });

    it('does not iterate through not owned properties', () => {
      const person = new Person('Eusebio');

      const result = reduce(person, reducer, 0);

      expect(result).toEqual(1);
      expect(reducer).toHaveBeenCalledTimes(1);
      expect(reducer).toHaveBeenCalledWith(0, 'name', person.name, expect.any(Number));
    });

    it('does not iterate if the object is null', () => {
      const result = reduce(null, reducer, 0);

      expect(result).toEqual(0);
      expect(reducer).not.toHaveBeenCalled();
    });

    it('does not iterate if the object is undefined', () => {
      const result = reduce(undefined, reducer, 0);

      expect(result).toEqual(0);
      expect(reducer).not.toHaveBeenCalled();
    });

    /**
     * Expects reduce to have been called with valid parameters.
     *
     * @param obj - The object to iterate.
     * @param callback - The callback to apply.
     *
     * @internal
     */
    function expectReduceToHaveBeenCalledWithValidParameters(
      obj: Dictionary,
      callback: jest.Mock = reducer
    ): void {
      const objEntries = Object.entries(obj);
      expect(callback).toHaveBeenCalledTimes(objEntries.length);
      expect(objEntries).toHaveLength(objEntries.length);
      objEntries.forEach(([prop, value]) => {
        expect(callback).toHaveBeenCalledWith(expect.any(Number), prop, value, expect.any(Number));
      });
    }

    /**
     * Expects reduce to have been called with valid index parameter.
     *
     * @param callback - The callback to apply.
     *
     * @internal
     */
    function expectReduceCallsToHaveValidIndexParameter(callback: jest.Mock = reducer): void {
      callback.mock.calls
        .map(function selectIndexParameter(call) {
          return call[3];
        }) // 4th parameter of the reduce call is the index
        .sort(function sortIndexAscending(i1, i2) {
          return i1 - i2;
        }) // Sort them from lower to higher index
        .forEach((forEachIndex, index) => {
          expect(forEachIndex).toBeGreaterThanOrEqual(index);
        });
    }
  });

  describe('map', () => {
    const mapCallback = jest.fn((_: string, propertyValue: any) => !!propertyValue);
    // Transform each property to a boolean

    it('iterates through object properties', () => {
      const obj = {
        a: 1,
        b: true,
        c: 'hello',
        d: [],
        e: {},
        f: () => {
          return;
        }
      };

      const result = map(obj, mapCallback);

      expect(result).toEqual({
        a: true,
        b: true,
        c: true,
        d: true,
        e: true,
        f: true
      });
      expectMapToHaveBeenCalledWithValidParameters(obj);
      expectMapCallsToHaveValidIndexParameter();
    });

    it('does not iterate through undefined values', () => {
      const obj = { a: 0, b: false, c: '', d: null, e: undefined };

      const result = map(obj, mapCallback);

      const { e, ...objToIterate } = obj;
      expect(result).toEqual({ a: false, b: false, c: false, d: false });
      expectMapToHaveBeenCalledWithValidParameters(objToIterate);
      expectMapCallsToHaveValidIndexParameter();
      expect(mapCallback).not.toHaveBeenCalledWith('e', obj.e, expect.any(Number));
    });

    it('does not iterate through not owned properties', () => {
      const person = new Person('Eusebio');

      const result = map(person, mapCallback);

      expect(result).toEqual({ name: true });
      expect(mapCallback).toHaveBeenCalledTimes(1);
      expect(mapCallback).toHaveBeenCalledWith('name', person.name, expect.any(Number));
    });

    it('does not iterate if the object is null', () => {
      const result = map(null, mapCallback);

      expect(result).toEqual({});
      expect(mapCallback).not.toHaveBeenCalled();
    });

    it('does not iterate if the object is undefined', () => {
      const result = map(undefined, mapCallback);

      expect(result).toEqual({});
      expect(mapCallback).not.toHaveBeenCalled();
    });

    /**
     * Expects map to have been called with valid parameters.
     *
     * @param obj - The object to iterate.
     * @param callback - The callback to apply.
     *
     * @internal
     */
    function expectMapToHaveBeenCalledWithValidParameters(
      obj: Dictionary,
      callback: jest.Mock = mapCallback
    ): void {
      const objEntries = Object.entries(obj);
      expect(callback).toHaveBeenCalledTimes(objEntries.length);
      expect(objEntries).toHaveLength(objEntries.length);
      objEntries.forEach(([prop, value]) => {
        expect(callback).toHaveBeenCalledWith(prop, value, expect.any(Number));
      });
    }

    /**
     * Expects map to have been called with valid index parameter.
     *
     * @param callback - The callback to apply.
     *
     * @internal
     */
    function expectMapCallsToHaveValidIndexParameter(callback: jest.Mock = mapCallback): void {
      callback.mock.calls
        .map(function selectIndexParameter(call) {
          return call[2];
        }) // 3rd parameter of the forEach call is the index
        .sort(function sortIndexAscending(i1, i2) {
          return i1 - i2;
        }) // Sort them from lower to higher index
        .forEach((forEachIndex, index) => {
          expect(forEachIndex).toBeGreaterThanOrEqual(index);
        });
    }
  });

  describe('cleanUndefined', () => {
    it('cleans undefined values from an object', () => {
      const testObj = {
        a: 1,
        b: 2,
        c: undefined
      };

      const cleanObject = cleanUndefined(testObj);
      expect(hasProperty(cleanObject, 'a')).toBe(true);
      expect(hasProperty(cleanObject, 'b')).toBe(true);
      expect(hasProperty(cleanObject, 'c')).not.toBe(true);
    });

    it('cleans undefined values from an object recursively', () => {
      const testObj = {
        a: 1,
        b: {
          c: 2,
          d: undefined,
          e: {
            f: undefined,
            g: 3
          },
          h: {}
        }
      };

      const cleanObject = cleanUndefined(testObj);
      expect(hasProperty(cleanObject, 'a')).toBe(true);
      expect(hasProperty(cleanObject, 'b')).toBe(true);
      expect(hasProperty(cleanObject.b, 'c')).toBe(true);
      expect(hasProperty(cleanObject.b, 'd')).not.toBe(true);
      expect(hasProperty(cleanObject.b, 'e')).toBe(true);
      expect(hasProperty(cleanObject.b.e, 'f')).not.toBe(true);
      expect(hasProperty(cleanObject.b.e, 'g')).toBe(true);
      expect(hasProperty(cleanObject.b, 'h')).toBe(true);
    });

    it('returns the same value as passed if it is not an object', () => {
      const testValue1 = 'a';
      const returnedValue1 = cleanUndefined(testValue1);
      expect(returnedValue1).toBe(testValue1);

      const testValue2 = 1;
      const returnedValue2 = cleanUndefined(testValue2);
      expect(returnedValue2).toBe(testValue2);
    });

    it('returns undefined if the value passed is undefined', () => {
      const returnedValue = cleanUndefined(undefined);
      expect(returnedValue).toBeUndefined();
    });

    it('returns null if the value passed is null', () => {
      const returnedValue = cleanUndefined(null);
      expect(returnedValue).toBeNull();
    });

    it('returns arrays untouched', () => {
      const returnedValue = cleanUndefined({ a: [undefined, 1] });
      expect(returnedValue.a).toEqual([undefined, 1]);
    });

    /**
     * Checks if the object has the given property.
     *
     * @param obj - The object to check.
     * @param key - The property to check.
     *
     * @returns True if the property exists. Else, false.
     *
     * @internal
     */
    function hasProperty(obj: any, key: string): boolean {
      return key in obj;
    }
  });

  describe('cleanEmpty', () => {
    it('cleans empty values from an object', () => {
      const testObj = {
        a: 1,
        b: 2,
        c: undefined,
        d: '',
        e: null,
        f: [],
        g: {}
      };

      const cleanObject = cleanEmpty(testObj);
      expect(cleanObject).toStrictEqual({
        a: 1,
        b: 2
      });
    });

    it('cleans empty values from an object recursively', () => {
      const testObj = {
        a: 1,
        b: {
          c: 2,
          d: undefined,
          e: '',
          f: {
            g: ['hey'],
            h: 3,
            i: null,
            j: {}
          },
          k: [],
          l: 'test'
        }
      };

      const cleanObject = cleanEmpty(testObj);
      expect(cleanObject).toStrictEqual({
        a: 1,
        b: {
          c: 2,
          f: {
            g: ['hey'],
            h: 3
          },
          l: 'test'
        }
      });
    });

    it('cleans nested empty objects from an object', () => {
      const testObj = { a: { b: { c: { d: '' } } } };

      const cleanObject = cleanEmpty(testObj);
      expect(cleanObject).toStrictEqual({});
    });
  });

  describe('getKeysWithDifferentValue', () => {
    it('returns an empty array when both objects are undefined', () => {
      const newValue = undefined;
      const oldValue = undefined;

      expect(getNewAndUpdatedKeys(newValue, oldValue)).toEqual([]);
    });

    it('returns an empty array when any of the objects is undefined', () => {
      const newValue = { a: 1 };
      const oldValue = undefined;

      expect(getNewAndUpdatedKeys(newValue, oldValue)).toEqual([]);

      const anotherNewValue = undefined;
      const anotherOldValue = { a: '1' };

      expect(getNewAndUpdatedKeys(anotherNewValue, anotherOldValue)).toEqual([]);
    });

    it('returns an empty array when both objects are the same', () => {
      const newValue = {};
      const oldValue = newValue;

      expect(getNewAndUpdatedKeys(newValue, oldValue)).toEqual([]);

      const anotherNewValue = { a: 1, b: '2' };
      const anotherOldValue = anotherNewValue;

      expect(getNewAndUpdatedKeys(anotherNewValue, anotherOldValue)).toEqual([]);
    });

    it('returns an empty array when both objects have same structure and values', () => {
      const newValue = {};
      const oldValue = {};

      expect(getNewAndUpdatedKeys(newValue, oldValue)).toEqual([]);

      const anotherNewValue = { a: 1, b: '2' };
      const anotherOldValue = { a: 1, b: '2' };

      expect(getNewAndUpdatedKeys(anotherNewValue, anotherOldValue)).toEqual([]);
    });

    it('returns an array with the keys that have different value', () => {
      const newValue = { a: 2, b: 'fried potatoe', c: 'same value' };
      const oldValue = { a: 1, b: 'potatoe', c: 'same value' };

      expect(getNewAndUpdatedKeys(newValue, oldValue)).toEqual(['a', 'b']);
    });

    it('returns an array with the keys that were not present in the oldValue object', () => {
      const newValue = { a: 1, b: 'potatoe', c: 'not present' };
      const oldValue = { a: 1, b: 'potatoe' };

      expect(getNewAndUpdatedKeys(newValue, oldValue)).toEqual(['c']);
    });
  });

  describe('every', () => {
    it('returns true when every entry of the given object passes the condition', () => {
      expect(every({ a: 1, b: 2 }, (_key, value) => typeof value === 'number')).toBe(true);
      expect(every({ a: 1, b: undefined }, (_key, value) => typeof value === 'number')).toBe(true);
    });

    it('returns false when not every entry of the given object passes the condition', () => {
      expect(every({ a: 1, b: '2' }, (_key, value) => typeof value === 'number')).toBe(false);
      expect(every({ a: '1', b: 2 }, (_key, value) => typeof value === 'number')).toBe(false);
    });
  });

  describe('flatObject', () => {
    it('returns a flattened object', () => {
      const obj = {
        a: 1,
        b: '2',
        c: {
          d: 3,
          e: ['4', '4.5'],
          f: {
            g: 5,
            h: {
              i: 6,
              j: {},
              k: null,
              l: function () {
                return 'm';
              }
            }
          }
        }
      };
      expect(flatObject(obj)).toStrictEqual({
        a: 1,
        b: '2',
        d: 3,
        e: ['4', '4.5'],
        g: 5,
        i: 6,
        k: null,
        l: obj.c.f.h.l
      });
    });
  });

  describe('rename', () => {
    const sampleObject = {
      anString: 'string',
      aNumber: 10,
      anObject: {
        notRenamedBoolean: true
      }
    };
    it('allows using a prefix', () => {
      const result = rename(sampleObject, { prefix: '_' });
      expect(result._anString).toEqual(sampleObject.anString);
      expect(result._aNumber).toEqual(sampleObject.aNumber);
      expect(result._anObject).toEqual(sampleObject.anObject);
      expect(result._anObject.notRenamedBoolean).toEqual(sampleObject.anObject.notRenamedBoolean);
    });
    it('allows using a suffix', () => {
      const result = rename(sampleObject, { suffix: '_' });
      expect(result.anString_).toEqual(sampleObject.anString);
      expect(result.aNumber_).toEqual(sampleObject.aNumber);
      expect(result.anObject_).toEqual(sampleObject.anObject);
      expect(result.anObject_.notRenamedBoolean).toEqual(sampleObject.anObject.notRenamedBoolean);
    });
    it('allows using both prefix and a suffix', () => {
      const result = rename(sampleObject, { prefix: '_', suffix: '_' });
      expect(result._anString_).toEqual(sampleObject.anString);
      expect(result._aNumber_).toEqual(sampleObject.aNumber);
      expect(result._anObject_).toEqual(sampleObject.anObject);
      expect(result._anObject_.notRenamedBoolean).toEqual(sampleObject.anObject.notRenamedBoolean);
    });
    it('excludes undefined properties', () => {
      const result = rename(
        { anString: 'string', anUndef: undefined },
        { prefix: '_', suffix: '_' }
      );
      expect(result._anString_).toEqual(sampleObject.anString);
      expect(result).not.toHaveProperty('_anUndef_');
    });
  });
});
