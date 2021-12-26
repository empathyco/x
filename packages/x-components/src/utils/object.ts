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
export function getKeysWithDifferentValue<ObjectType extends Dictionary>(
  newValue?: ObjectType,
  oldValue?: ObjectType
): (keyof ObjectType)[] {
  if (newValue === oldValue || !newValue || !oldValue) {
    return [];
  }

  return Object.keys(newValue).filter(key => !(key in oldValue) || newValue[key] !== oldValue[key]);
}
