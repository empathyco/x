import { ThrottleFunction } from './types';

/**
 * Util function that returns a throttled version of the function passed as parameter.
 *
 * @param fn - Function to be debounced.
 * @param throttleTimeMs - The time of throttle in ms.
 * @param options - Advanced options to throttle the function with.
 * @returns A new function with the throttle.
 *
 * @public
 */

export const throttle = <Params extends any[]>(
  fn: (...args: Params) => void,
  throttleTimeMs: number,
  { leading = false }: ThrottleOptions = {}
): ThrottleFunction<Params> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let params: Params;
  let leadingCallTimestamp: number | undefined = undefined;

  const throttleFn: ThrottleFunction<Params> = (...args) => {
    params = args;
    if (leading && !leadingCallTimestamp) {
      fn(...params);
      leadingCallTimestamp = Date.now();
      setTimeout(() => {
        leadingCallTimestamp = undefined;
      }, throttleTimeMs);
    } else if (!timeout) {
      const delay = leadingCallTimestamp
        ? throttleTimeMs - (Date.now() - leadingCallTimestamp)
        : throttleTimeMs;
      timeout = setTimeout(() => {
        fn(...params);
        timeout = undefined;
      }, delay);
    }
  };

  return throttleFn;
};

export interface ThrottleOptions {
  leading?: boolean;
}
