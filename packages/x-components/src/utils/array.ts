import { PropsWithType } from './types';

/**
 * Returns if the given array is `null`, `undefined`, or has no elements.
 *
 * @param array - The array to check if it is empty.
 * @returns `true` if the array is `null`, `undefined`, or has no elements. `false` otherwise.
 * @public
 */
export function isArrayEmpty(array: unknown[] | undefined | null): array is undefined | null | [] {
  return array == null || array.length === 0;
}

/**
 * Reduce an array of strings to an object which properties names are the value of each string,
 * and the value under that property are also the string.
 *
 * @param array - Array of strings that will be used to create the object.
 *
 * @returns New object which properties object[key] contains object of each iteration in the
 * array.
 *
 * @example Converting an array to an object:
 *         arrayToObject(['a', 'b', 'c']) === \{a: 'a', b: 'b', c: 'c'\}
 *
 * @public
 */
export function arrayToObject(array: string[]): Record<string, string>;
/**
 * Reduce an array of objects to an object which properties names are the value of each object[key],
 * and the value under that property are each object. 'key' is the the parameter passed to this
 * function.
 *
 * @param array - Array of objects that contains objects which have object[key] string as a property
 * value.
 * @param key - Key used to access to each object[key] value, used for each property name in the new
 * object.
 *
 * @returns New object which properties object[key] contains object of each iteration in the array.
 *
 * @public
 */
export function arrayToObject<ArrayType>(
  array: ArrayType[],
  key: PropsWithType<ArrayType, string>
): Record<string, ArrayType>;
/**
 * Reduce an array to an object. The type of the object returned depends on the type of the params.
 * If the 'key' is passed then the function returns an object which properties names are the value
 * of each object[key] and the value under that property are each object.
 * If the 'key' is not passed then the function returns an object which properties names are each
 * array item, and the value is also the array item.
 *
 * @param array - Array from which to create an object.
 * @param key - Key used to access to each object[key] value, used for each property name in the
 * new object.
 *
 * @returns New object which properties object[key] contains each item in the array and the key is
 * either the item of the array or a property of each item designated by 'key' param.
 *
 * @public
 */
export function arrayToObject<ArrayType>(
  array: ArrayType[],
  key?: PropsWithType<ArrayType, string>
): Record<string, ArrayType> {
  return array.reduce<Record<string, ArrayType>>((accumulator, current) => {
    if (key) {
      accumulator[current[key] as any] = current;
    } else if (typeof current === 'string') {
      accumulator[current] = current;
    }
    return accumulator;
  }, {});
}

/**
 * Groups the array items based on the provided `groupBy` function.
 *
 * @param array - The array to iterate, grouping its items in different arrays based on the
 * `groupBy` function.
 * @param groupBy - A function to determine the group name of a single item.
 * @returns The items grouped in a dictionary.
 *
 * @public
 */
export function groupItemsBy<ArrayType, ReturnType extends string | number>(
  array: ArrayType[],
  groupBy: (item: ArrayType, index: number) => ReturnType
): Record<ReturnType, ArrayType[]> {
  return array.reduce<Record<ReturnType, ArrayType[]>>((accumulator, current, index) => {
    const keyValue = groupBy(current, index);
    if (!accumulator[keyValue]) {
      accumulator[keyValue] = [];
    }
    accumulator[keyValue].push(current);
    return accumulator;
  }, {} as Record<ReturnType, ArrayType[]>);
}

/**
 * Filters an array with all elements that pass the test implemented by the provided filter
 * function. It also does it recursively if the property accessed, whose name is the parameter
 * childrenKey, to the current iteration in an array.
 *
 * @param array - Array to be filtered.
 * @param filter - Predicate function to test each element of the array. It should return true
 * to keep the element; or false otherwise.
 * @param childrenKey - Property name within the array used to perform a recursive call.
 *
 * @example
 * Input - Output example
 *
 * ```
 * const hierarchicalFilters: Filter[] = [
 *   {
 *     id: 'filter1'
 *     selected: true,
 *     children: [
 *       {
 *         id: 'filter1-1'
 *         selected: true,
 *         children: []
 *       },
 *       {
 *         id: 'filter1-2'
 *         selected: false,
 *         children: []
 *       }
 *     ]
 *   },
 *   {
 *     id: 'filter2',
 *     selected: false,
 *     children: [
 *      {
 *        id: 'filter2-1',
 *        selected: true // not should happen
 *      }
 *     ]
 *   }
 * ]
 *
 *  const filteredArray: Filter[] = deepFilterArray(
 *    hierarchicalFilters,
 *    filter => filter.selected,
 *    'children'
 *  )
 *
 *  /*
 *    filteredArray = [
 *      {
 *        id: 'filter1'
 *        selected: true,
 *        children: [
 *          {
 *            id: 'filter1-1'
 *            selected: true,
 *            children: []
 *          },
 *          {
 *            id: 'filter1-2'
 *            selected: false,
 *            children: []
 *          }
 *        ]
 *      },
 *      {
 *        id: 'filter1-1'
 *        selected: true,
 *        children: []
 *      }
 *    ]
 * ```
 *
 * @returns A new array with the elements that pass the test, or an empty array if no one
 * pass the test.
 *
 * @public
 */
export function deepFilter<
  ArrayType extends { [key in Key]?: ArrayType[] },
  Key extends keyof ArrayType
>(array: ArrayType[], filter: (item: ArrayType) => boolean, childrenKey: Key): ArrayType[] {
  return array.reduce<ArrayType[]>(function filterArray(filteredArray, item) {
    if (filter(item)) {
      filteredArray.push(item);
      item[childrenKey]?.reduce(filterArray, filteredArray);
    }
    return filteredArray;
  }, []);
}

/**
 * Flat an ArrayType[] recursively using the childrenKey passed as parameter to access to his nested
 * child which is also ArrayType[].
 *
 * @param array - ArrayType[] which each ArrayType has a property childrenKey which value is also
 * an ArrayType[].
 * @param childrenKey - Key used to access to each ArrayType[childrenKey] value which is also
 * an ArrayType[].
 *
 * @returns ArrayType[] with all the nested ArrayType, including the nested ones, at the same depth
 * level.
 *
 * @public
 */
export function deepFlat<
  ArrayType extends { [key in Key]?: ArrayType[] },
  Key extends keyof ArrayType
>(array: ArrayType[], childrenKey: Key): ArrayType[] {
  return array.reduce<ArrayType[]>(function flat(flattenedArray, item) {
    flattenedArray.push(item);
    item[childrenKey]?.reduce(flat, flattenedArray);
    return flattenedArray;
  }, []);
}

/**
 * Creates an Emitter filter function to compare two arrays and filter those that are equal.
 *
 * @param comparator - String with the name of the field of the arrays items to compare, or function
 * to compare items directly.
 * @returns The comparator function that receives two arrays to compare them.
 *
 * @internal
 */
export function createEmitterArrayFilter<T>(
  comparator: keyof T | ((item1: T, item2: T) => boolean)
): (newCollection: Array<T>, oldCollection: Array<T>) => boolean {
  const comparatorFn =
    typeof comparator === 'function'
      ? comparator
      : (newItem: T, oldItem: T) => newItem[comparator] === oldItem[comparator];
  return function (newCollection: Array<T>, oldCollection: Array<T>): boolean {
    return (
      newCollection.length !== oldCollection.length ||
      newCollection.some(newItem => !oldCollection.find(oldItem => comparatorFn(newItem, oldItem)))
    );
  };
}
