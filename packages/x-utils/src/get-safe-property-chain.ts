import { ExtractType, ExtractPath } from './types';

/**
 * Safely searches for a chain of properties in an object.
 *
 * @param obj - The object to safe search in for the chain of properties.
 * @param propertyChain - The chain of properties, separated by a dot, to search for.
 * @param defaultReturn - The value to return if any of the intermediate or the final value is not
 * defined.
 * @remarks The `defaultReturn` parameter has been left here for retro-compatibility. We recommend
 * to use coalescing operator (`??`) instead.
 *
 * @returns The value of the chain of properties, or `undefined` if any of the intermediate values
 * is not defined.
 */
export function getSafePropertyChain<SomeObject, Path extends ExtractPath<SomeObject>>(
  obj: SomeObject,
  propertyChain: Path,
  defaultReturn?: ExtractType<SomeObject, Path>
): ExtractType<SomeObject, Path> | undefined;
/**
 * Safely searches for a chain of properties in an object.
 *
 * @param obj - The object to safe search in for the chain of properties.
 * @param propertyChain - The chain of properties, separated by a dot, to search for.
 * @param defaultReturn - The value to return if any of the intermediate or the final value is not
 * defined.
 * @remarks The `defaultReturn` parameter has been left here for retro-compatibility. We recommend
 * to use coalescing operator (`??`) instead.
 *
 * @returns The value of the chain of properties, or the default return if any of the intermediate
 * values is not defined.
 */
export function getSafePropertyChain<SomeObject>(
  obj: SomeObject,
  propertyChain: '',
  defaultReturn?: SomeObject
): SomeObject;
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
export function getSafePropertyChain<SomeObject, Path extends ExtractPath<SomeObject>>(
  obj: SomeObject,
  propertyChain: Path | '',
  defaultReturn?: ExtractType<SomeObject, Path>
): ExtractType<SomeObject, Path> {
  const resolved = getChain(obj, ...propertyChain.split('.'));
  return resolved === undefined ? defaultReturn : resolved;
}

/**
 * Searches for the value of a list of property names inside the object.
 *
 * @param obj - The object to search in.
 * @param property - The current property to search for.
 * @param propertyChain - The remaining properties to search for.
 * @returns The value to search for, or `undefined` if any of the intermediate values is not
 * defined.
 */
function getChain<T = any>(obj: any, property = '', ...propertyChain: string[]): T | undefined {
  return obj == null && property
    ? undefined
    : !property
    ? obj
    : getChain(obj[property], ...propertyChain);
}
