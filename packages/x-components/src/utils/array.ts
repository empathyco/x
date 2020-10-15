import { PropsWithType } from './types';

/**
 * Returns if the given array is `null`, `undefined`, or has no elements.
 *
 * @param array - The array to check if it is empty.
 * @returns `true` if the array is `null`, `undefined`, or has no elements. `false` otherwise.
 * @public
 */
export function isArrayEmpty(array: unknown[] | undefined | null): array is undefined | null | [] {
  // eslint-disable-next-line
  return array == null || array.length === 0;
}

/**
 * Reduce an array of objects to an object which properties names are the value of each object[key],
 * and the value under that property are each object. 'key' is the the parameter passed to this
 * function.
 *
 * @param array - Array of objects that contains objects which have object[key] string as a
 * property value.
 * @param key - Key used to access to each object[key] value, used for each property name in the
 * new object.
 *
 * @returns New object which properties object[key] contains object of each iteration in the array.
 *
 * @public
 */
export function arrayToObject<ArrayType extends Record<keyof ArrayType, unknown>>(
  array: ArrayType[],
  key: PropsWithType<ArrayType, string>
): Record<string, ArrayType> {
  return array.reduce<Record<string, ArrayType>>((acc, current) => {
    acc[current[key] as string] = current;
    return acc;
  }, {});
}
