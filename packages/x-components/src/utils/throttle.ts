import { ThrottleFunction } from './types';

/**
 * Util function that returns a throttled version of the function passed as parameter.
 *
 * @param fn - Function to be debounced.
 * @param throttleTimeMs - The time of throttle in ms.
 * @returns A new function with the throttle.
 *
 * @public
 */

export const throttle = <Params extends any[]>(
  fn: (...args: Params) => void,
  throttleTimeMs: number
): ThrottleFunction<Params> => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let params: Params;

  const throttleFn: ThrottleFunction<Params> = (...args) => {
    params = args;
    if (!timeout) {
      timeout = setTimeout(() => {
        fn(...params);
        timeout = undefined;
      }, throttleTimeMs);
    }
  };

  return throttleFn;
};
