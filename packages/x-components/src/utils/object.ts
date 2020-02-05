import { Dictionary } from './types';

/**
 * Iterates over every non-undefined property of the object calling the callback passed as parameter.
 * @param obj The object to iterate through each property
 * @param callbackFn The callback function to call for each property
 */
export function forEach<T extends Dictionary>(
  obj: T | undefined | null,
  callbackFn: (
    key: keyof T,
    value: Exclude<T[keyof T], undefined>,
    index: number
  ) => void
): void {
  if (obj == null) {
    return;
  }
  let index = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      callbackFn(key, obj[key], index++);
    }
  }
}

/**
 * Iterates through the obj properties calling the reducer function
 * @param obj The object to iterate through each property
 * @param reducer A function that will be called for each property, modifying the initialValue object
 * @param initialValue The initial value of the accumulator property of the reducer function.
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
 * @param obj The object to transform each property value
 * @param mapper The mapper function which will transform each value.
 */
export function map<T extends Dictionary, W>(
  obj: T | undefined | null,
  mapper: (
    key: keyof T,
    value: Exclude<T[keyof T], undefined>,
    index: number
  ) => W
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
