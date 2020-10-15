import { noOp } from './function';

/**
 * The type returned by the {@link cancellablePromise} function.
 *
 * @public
 */
interface CancellablePromiseFunction<T> {
  /**
   * The resultant promise that groups the original promise, passed as the first parameter, and the
   * promise created in cancellablePromise, which rejects the resultant promise if called.
   */
  promise: Promise<T>;
  /**
   * Function to cancel the resultant promise. This function triggers the reject of the second
   * promise of the promise race. The first parameter is the resultant promise rejection value.
   */
  cancel: (arg0?: any) => void;
}

/**
 * Util function that returns an object which contains a promise, result of Promise.race call
 * between the original one passed as parameter and another one, created within the function, used
 * for reject in the resultant promise manually. If the cancel method is triggered, the
 * resultant promise is rejected.
 *
 * @remarks The promise function passed as first param executes its own async code ALWAYS although
 * it's cancelled or not. The payload of the resultant promise is the returned by the function that
 * ends first. So, the promise is not cancelled exactly. The parameter first passed to cancel is the
 * resultant promise rejection value.
 *
 * @param promise - Original promise.
 * @returns CancellablePromiseFunction {@link CancellablePromiseFunction}.
 *
 * @internal
 */
export function cancellablePromise<T>(promise: Promise<T>): CancellablePromiseFunction<T> {
  let cancel = noOp;

  const cancelPromise = new Promise<T>((_, reject) => {
    cancel = reject;
  });

  return {
    promise: Promise.race([promise, cancelPromise]),
    cancel
  };
}
