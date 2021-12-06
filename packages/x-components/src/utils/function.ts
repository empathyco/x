/**
 * Util function to be used as default parameter for callbacks, or optional functions
 * implementations.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noOp(): any {}

/**
 * Returns the same value that it was provided with.
 *
 * @param value - The value to return.
 * @returns The same value it was passed in.
 * @internal
 */
export function identity<T>(value: T): T {
  return value;
}
