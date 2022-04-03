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
export function extractValue<SomeObject extends Dictionary>(
  obj: SomeObject,
  path: ExtractPath<SomeObject>
): ExtractType<SomeObject, ExtractPath<SomeObject>> {
  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const value = path.split('.').reduce((acc, key) => (acc ? acc[key] : obj[key]), undefined);

  if (value == null) {
    throw new Error(
      'Trying to extract the value of an invalid property path or a property with a nullish value'
    );
  }

  return value;
}
