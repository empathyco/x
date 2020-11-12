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
  return array.reduce<Record<string, ArrayType>>((accumulator, current) => {
    accumulator[current[key] as string] = current;
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
export function groupItemsBy<ArrayType, ReturnType extends string>(
  array: ArrayType[],
  groupBy: (item: ArrayType) => ReturnType
): Record<ReturnType, ArrayType[]> {
  return array.reduce<Record<string, ArrayType[]>>((accumulator, current) => {
    const keyValue = groupBy(current);
    if (!accumulator[keyValue]) {
      accumulator[keyValue] = [];
    }
    accumulator[keyValue].push(current);
    return accumulator;
  }, {});
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
export function deepFilter<ArrayType, Key extends PropsWithType<ArrayType, ArrayType[]>>(
  array: ArrayType[],
  filter: (item: ArrayType) => boolean,
  childrenKey: Key
): ArrayType[] {
  const filterArray = function (
    currentArray: ArrayType[],
    initialArray: ArrayType[] = []
  ): ArrayType[] {
    return currentArray.reduce((result, currentItem) => {
      if (filter(currentItem)) {
        result.push(currentItem);
        filterArray(currentItem[childrenKey], result);
      }

      return result;
    }, initialArray);
  };

  return filterArray(array);
}
