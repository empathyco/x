import { isArray, isObject } from './typeguards';
import { Dictionary } from './types';

/**
 * Iterates over every non-undefined property of the object calling the callback passed as
 * parameter.
 *
 * @param obj - The object to iterate through each property.
 * @param callbackFn - The callback function to call for each property.
 * @public
 */
export function forEach<T extends Dictionary>(
  obj: T | undefined | null,
  callbackFn: (key: keyof T, value: Exclude<T[keyof T], undefined>, index: number) => void
): void {
  if (obj == null) {
    return;
  }

  let index = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      callbackFn(key, obj[key], index++);
    }
  }
}

/**
 * Iterates through the obj properties calling the reducer function.
 *
 * @param obj - The object to iterate through each property.
 * @param reducer - A function that will be called for each property, modifying the initialValue
 * object.
 * @param initialValue - The initial value of the accumulator property of the reducer function.
 * @returns Result of the reducer function.
 * @public
 */
export function reduce<T extends Dictionary, V>(
  obj: T | undefined | null,
  reducer: (
    accumulator: V,
    key: keyof T,
    value: Exclude<T[keyof T], undefined>,
    index: number
  ) => V,
  initialValue: V
): V {
  let accumulator = initialValue;
  forEach(obj, (key, value, index) => {
    accumulator = reducer(accumulator, key, value, index);
  });
  return accumulator;
}

/**
 * Creates an object from another object transforming each property value.
 *
 * @param obj - The object to transform each property value.
 * @param mapper - The mapper function which will transform each value.
 * @returns A record with the result of the mapper.
 * @public
 */
export function map<T extends Dictionary, W>(
  obj: T | undefined | null,
  mapper: (key: keyof T, value: Exclude<T[keyof T], undefined>, index: number) => W
): Record<keyof T, W> {
  return reduce(
    obj,
    (accumulator, key, value, index) => {
      accumulator[key] = mapper(key, value, index);
      return accumulator;
    },
    {} as Record<keyof T, W>
  );
}

/**
 * Creates an object picking only the not undefined properties.
 *
 * @param obj - The object from whom pick the values.
 * @returns A new object with the not undefined properties of the source object.
 * @public
 */
export function cleanUndefined<T>(obj: T): T {
  return typeof obj !== 'object' || obj === null || Array.isArray(obj)
    ? obj
    : reduce(
        obj,
        (pickedObject, key, value) => {
          pickedObject[key] = cleanUndefined(value);
          return pickedObject;
        },
        {} as T
      );
}

/**
 * Creates an object picking only the properties whose values are not:
 * - `undefined`.
 * - `null`.
 * - an empty string.
 * - an empty array.
 * - an empty object.
 *
 * @param obj - The object from whom pick the values.
 * @returns A new object with the not empty properties of the source object.
 * @public
 */
export function cleanEmpty<SomeObject extends Record<string, unknown>>(
  obj: SomeObject
): SomeObject {
  return reduce(
    obj,
    (pickedObject, key, value) => {
      // FIXME: Clean nested empty arrays too
      if (isObject(value)) {
        pickedObject[key] = cleanEmpty(value);
        if (Object.keys(pickedObject[key] as typeof value).length === 0) {
          delete pickedObject[key];
        }
      } else if (value !== null && value !== '' && !(isArray(value) && value.length === 0)) {
        pickedObject[key] = value;
      }
      return pickedObject;
    },
    {} as SomeObject
  );
}

/**
 * Creates an object picking only the ones that pass the test implemented by the
 * provided function isIncluded.
 *
 * @param obj - T object to be filtered.
 * @param isIncluded - Test function that every obj item must pass.
 * @returns A filtered object.
 * @public
 */
export function objectFilter<T extends Dictionary>(
  obj: T | undefined | null,
  isIncluded: (key: keyof T, value: Exclude<T[keyof T], undefined>, index: number) => boolean
): T {
  return reduce(
    obj,
    (accumulator, key, value, index) => {
      if (isIncluded(key, value, index)) {
        accumulator[key] = value;
      }
      return accumulator;
    },
    {} as T
  );
}

/**
 * Compares two objects of the same type, checking the values of their keys and retrieving
 * those that were not present in the old value and/or those whose value has changed.
 *
 * @param newValue - The new object value.
 * @param oldValue - The old object value.
 *
 * @returns An array of keys.
 * @public
 */
export function getNewAndUpdatedKeys<ObjectType extends Dictionary>(
  newValue: ObjectType | undefined,
  oldValue: ObjectType | undefined
): (keyof ObjectType)[] {
  if (newValue === oldValue || !newValue || !oldValue) {
    return [];
  }

  return Object.keys(newValue).filter(key => !(key in oldValue) || newValue[key] !== oldValue[key]);
}

/**
 * Ensures that the given condition is met in all the non-undefined entries of the object.
 *
 * @param object - The object to check if every item meets the given condition.
 * @param condition - The condition to check in each one of the entries of the object.
 *
 * @returns True when all the entries pass the condition. False otherwise.
 * @public
 */
export function every<ObjectType extends Dictionary>(
  object: ObjectType,
  condition: (
    key: keyof ObjectType,
    value: Exclude<ObjectType[keyof ObjectType], undefined>,
    index: number
  ) => boolean
): boolean {
  return Object.entries(object)
    .filter(([, value]) => value !== undefined)
    .every(([key, value], index) => condition(key, value, index));
}

/**
 * Flattens recursively the passed object to a one level object.
 *
 * @param object - The object to flatten.
 * @returns The flattened object.
 * @public
 */
export function flatObject(object: Dictionary): Dictionary {
  const flattenedObject: Dictionary = {};
  forEach(object, (key, value) => {
    if (isObject(value)) {
      Object.assign(flattenedObject, flatObject(value));
    } else {
      flattenedObject[key] = value;
    }
  });
  return flattenedObject;
}

/**
 * Renames the keys of an object adding a prefix, a suffix, or both.
 *
 * @param object - The object to rename its keys.
 * @param pattern - The options to rename with: a prefix and a suffix.
 * @returns A new object with the keys renamed following the pattern.
 * @public
 */
export function rename<
  SomeObject extends Dictionary,
  Prefix extends string = '',
  Suffix extends string = ''
>(
  object: SomeObject,
  { prefix, suffix }: RenameOptions<Prefix, Suffix>
): Rename<SomeObject, Prefix, Suffix> {
  return reduce(
    object,
    (renamed, key, value) => {
      renamed[
        `${prefix ?? ''}${key as string}${suffix ?? ''}` as keyof Rename<SomeObject, Prefix, Suffix>
      ] = value;
      return renamed;
    },
    {} as Rename<SomeObject, Prefix, Suffix>
  );
}

/**
 * Renames the keys of the given object prefixing and suffixing them.
 *
 * @public
 */
export type Rename<SomeObject, Prefix extends string, Suffix extends string> = {
  [Key in keyof SomeObject as `${Prefix}${Key & string}${Suffix}`]: SomeObject[Key];
};

/**
 * An optional prefix and suffix.
 *
 * @public
 */
interface RenameOptions<Prefix, Suffix> {
  prefix?: Prefix;
  suffix?: Suffix;
}
