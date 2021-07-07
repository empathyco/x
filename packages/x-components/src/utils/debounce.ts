/* eslint-disable max-len */
import { DebouncedFunction, DebounceOptions } from './types';

/**
 * Util function that returns a debounced version of the function passed as parameter. It can use
 * the leading strategy, trailing strategy or both. Using both would result in one leading
 * execution guaranteed and trailing executions only if there are further calls during the length
 * of the debounce time.
 *
 * @param fn - Function to be debounced.
 * @param debounceTimeInMs - The time of debounce in ms.
 * @param debounceOptions - The options for the debounce strategy.
 * @returns A new function with the debounce.
 *
 * @example Debounce options:
 *
 * Given this code, where you configure the `trailing` and `leading` options:
 *
 * ```js
 * const log = debounce(name => console.log(name), 1000, {
 *   leading
 *   trailing
 * });
 *
 *  log('a'); // +0ms
 *  log('b'); // +0ms
 *  log('c'); // +0ms
 *  setTimeout(() => log('d'), 1000); // +1000ms
 *  setTimeout(() => log('e'), 1500); // +500ms
 *  setTimeout(() => log('f'), 2600); // +1100ms
 * ```
 *
 * | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\ trailing<br/> leading \\ | **`false`** | **`true`**    |
 * |:----------------------------------------------------------------------------------------------------------|-------------|---------------|
 * | **`false`**                                                                                               |             | c, e, f       |
 * | **`true`**                                                                                                | a, d, f     | a, c, d, e, f |
 *
 * @public
 */
export const debounce = <Params extends any[]>(
  fn: (...args: Params) => void,
  debounceTimeInMs: number,
  { leading = false, trailing = true }: DebounceOptions = {}
): DebouncedFunction<Params> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debouncedFn: DebouncedFunction<Params> = (...args) => {
    const isFirstLeadingCall = leading && !timer;
    if (isFirstLeadingCall) {
      fn(...args);
    }
    const trailingFn = (): void => {
      timer = undefined;
      if (!isFirstLeadingCall && trailing) {
        fn(...args);
      }
    };
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => trailingFn(), debounceTimeInMs);
  };

  debouncedFn.cancel = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
  return debouncedFn;
};
