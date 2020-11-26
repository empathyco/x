import { noOp } from './function';
/**
 * Symbol used to know if a promise is cancelled.
 *
 * @internal
 */
export const CancelSymbol = Symbol('cancelled-promise');
/**
 * The type returned by the {@link cancellablePromise} function.
 *
 * @internal
 */
export interface CancellablePromiseFunction<T, K = unknown> {
  /**
   * The resultant promise that groups the original promise, passed as the first parameter, and the
   * promise created in cancellablePromise, which rejects the resultant promise if called.
   */
  promise: Promise<T>;
  /**
   * Function to cancel the resultant promise. This function triggers the reject of the second
   * promise of the promise race. The first parameter is the resultant promise rejection value.
   */
  cancel: (payload?: K) => void;
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
 * If you need to check if the promise is not being rejected with CancelSymbol (on purpose).
 * You should check the error type in the cancellable catch using the payload.
 *
 * @param promise - Original promise.
 * @param cancelCallback - Optional callback to be called on cancel.
 * @returns CancellablePromiseFunction {@link CancellablePromiseFunction}.
 *
 * @internal
 */
export function cancellablePromise<T, K = unknown>(
  promise: Promise<T>,
  cancelCallback?: (payload?: K) => void
): CancellablePromiseFunction<T, K> {
  let cancel: (payload?: K) => void = noOp;

  const cancelPromise = new Promise<never>((_, reject) => {
    cancel = payload => {
      reject(CancelSymbol);
      cancelCallback?.(payload);
    };
  });

  return {
    promise: Promise.race([promise, cancelPromise]),
    cancel
  };
}
