import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { Dictionary, ExtractPath, ExtractType } from '@empathyco/x-utils';

/**
 * Extracts the value of the given property's path from the given object.
 *
 * @param obj - The object to extract the property's value from.
 * @param path - The path to the object's property.
 *
 * @returns The value of the property.
 *
 * @public
 */
export function extractValue<SomeObject extends Dictionary, Path extends ExtractPath<SomeObject>>(
  obj: SomeObject | SomeObject[],
  path: Path
): ExtractType<SomeObject, Path> | ExtractType<SomeObject, Path>[] | undefined {
  const result = getSafePropertyChain(obj, path);
  if (isArrayOf<ExtractType<SomeObject, Path>>(result)) {
    return result;
  } else {
    return result as ExtractType<SomeObject, Path>;
  }
}

// TODO: Extract to x-utils
function isArrayOf<Type>(possibleArray: Type | Type[]): possibleArray is Type[] {
  return Array.isArray(possibleArray);
}
