import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { Dictionary, ExtractPath, ExtractType, isArray } from '@empathyco/x-utils';

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
  const result = getSafePropertyChain<ReturnType<SomeObject, Path>>(obj, path);
  if (result !== undefined) {
    if (isArray<ExtractType<SomeObject, Path>>(result)) {
      return result;
    } else {
      return result;
    }
  }
}

/**
 * Helper to narrow down the type of the returned value when calling `getSafePropertyChain()`.
 *
 * @param SomeObject - The object to check.
 * @param Path - The path to check.
 *
 * @internal
 */
type ReturnType<SomeObject, Path extends ExtractPath<SomeObject>> =
  | ExtractType<SomeObject, Path>
  | ExtractType<SomeObject, Path>[];
