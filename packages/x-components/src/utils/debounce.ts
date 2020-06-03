/**
 * The type returned by the {@link debounce} function. Basically is the function the
 * {@link debounce} receives but debounced and with a method `cancel()` to cancel pending timeouts.
 *
 * @param Params - The arguments type of the function.
 *
 * @internal
 */
export interface DebouncedFunction<Params extends any[]> {
  (...args: Params): void;
  cancel(): void;
}

/**
 * Util function that returns a debounced version of the function passed as parameter.
 *
 * @param fn - Function to be debounced.
 * @param debounceTimeInMs - The time of debounce in ms.
 *
 * @returns A new function with the debounce.
 *
 * @internal
 */
export const debounce = <Params extends any[]>(
  fn: (...args: Params) => void,
  debounceTimeInMs: number
): DebouncedFunction<Params> => {
  let timer: number | undefined;
  const debouncedFn: DebouncedFunction<Params> = (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), debounceTimeInMs);
  };
  // eslint-disable-next-line @typescript-eslint/unbound-method
  debouncedFn.cancel = () => clearTimeout(timer);
  return debouncedFn;
};
