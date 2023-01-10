/**
 * Safely searches for a chain of properties in an object.
 *
 * @param obj - The object to safe search in for the chain of properties.
 * @param propertyChain - The chain of properties, separated by a dot, to search for.
 *
 * @returns The value of the chain of properties, or `undefined` if any of the intermediate values
 * is not defined.
 */
export declare function getSafePropertyChain<T = any>(
  obj: any,
  propertyChain: string
): T | undefined;
/**
 * Safely searches for a chain of properties in an object.
 *
 * @param obj - The object to safe search in for the chain of properties.
 * @param propertyChain - The chain of properties, separated by a dot, to search for.
 * @param defaultReturn - The value to return if any of the intermediate or the final value is not
 * defined.
 *
 * @returns The value of the chain of properties, or the default return if any of the intermediate
 * values is not defined.
 */
export declare function getSafePropertyChain<T = any>(
  obj: any,
  propertyChain: string,
  defaultReturn?: T
): T;
