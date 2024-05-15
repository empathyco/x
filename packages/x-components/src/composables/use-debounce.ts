import { onBeforeUnmount } from 'vue';
import { debounce } from '../utils/debounce';
import { DebounceOptions } from '../utils/types';

/**
 * Composable which wraps the function passed as parameter into a debounced function and returns it.
 * It also cancels the debounced function when component is unmounted.
 *
 * @param fn - Function to be debounced.
 * @param debounceTimeInMs - Time of debounce in ms.
 * @param debounceOptions - The options for the debounce strategy.
 * @returns Debounced function obtained from `fn` parameter.
 */
export function useDebounce<Params extends any[]>(
  fn: (...args: Params) => void,
  debounceTimeInMs: number,
  debounceOptions: DebounceOptions = {}
) {
  const debouncedFn = debounce(fn, debounceTimeInMs, debounceOptions);

  onBeforeUnmount(() => {
    debouncedFn.cancel();
  });

  return debouncedFn;
}
