import { Keys, Primitive } from './utils.types';

/**
 * All the possible string paths to properties for a given object.
 *
 * @param SomeObject - The object type to extract the properties names from.
 * @example
 * ```typescript
 *   interface Result {
 *     id: string,
 *     price: {
 *       max: number,
 *       min: number
 *     },
 *     images: string[]
 *   }
 *
 *  type ResultPropertyPaths = PropertyPath<Result>;
 *  // "id" | "price" | "price.max" | "price.min" | "images" | `images.${number}`;
 * ```
 * @remarks
 * Be careful when using Records where the key name is typed only as string,
 * since this type will not be able to infer the key name. Use always a union type with all the
 * potential key name values when possible.
 *
 * When trying to get the path to an array item, keep in mind that a number ending with a dot is a
 * valid javascript syntax so this type will assume as safe getting the 'n.' element.
 * @public
 */
export type PropertyPath<SomeObject> = SomeObject extends (infer ArrayType)[]
  ? `${number}` | `${number}.${PropertyPath<ArrayType>}`
  : Keys<SomeObject, string> | NestedPropertyPath<SomeObject, Keys<SomeObject, string>>;

/**
 * String path for child properties from a given object.
 *
 * @param SomeObject - The object type to extract the properties names from.
 * @param PropName - Name of the property to get the path from.
 *
 * @internal
 */
type NestedPropertyPath<SomeObject, PropName extends string> = PropName extends keyof SomeObject
  ? // eslint-disable-next-line max-len
    SomeObject[PropName] extends SomeObject // Check that a child property is not from the same type as the parent to avoid infinite loops on recursive types
    ? `${PropName}.${Keys<SomeObject[PropName], string>}${any}`
    : // eslint-disable-next-line max-len
    SomeObject[PropName] extends SomeObject[] // Check that a child property is not from the same type as the parent to avoid infinite loops on recursive types
    ? `${PropName}.${number}` | `${PropName}.${number}.${Keys<SomeObject, string>}${any}`
    : // eslint-disable-next-line @typescript-eslint/ban-types
      `${PropName}.${PropertyPath<Exclude<SomeObject[PropName], Function | Primitive>>}`
  : never;

/**
 * Retrieves type of property for the given path from the provided object.
 *
 * @param SomeObject - The object to extract the property type from.
 * @param Path - String property path.
 * @example
 * ```typescript
 *   interface Result {
 *     id: string,
 *     price: {
 *       max: number,
 *       min: number
 *     },
 *     images: string[]
 *   }
 *
 *  type MaxPrice = PropertyType<Result, "price.max">; // number
 *  type FirstImageType = PropertyType<Result, "images.0">; // string
 * ```
 *
 * @public
 */
export type PropertyType<
  SomeObject,
  Path extends PropertyPath<SomeObject>
> = Path extends keyof SomeObject
  ? SomeObject[Path]
  : Path extends `${infer Property}.${infer RemainingPath}`
  ? PropertyType<
      SomeObject[keyof SomeObject & Property],
      PropertyPath<SomeObject[keyof SomeObject & Property]> & RemainingPath
    >
  : SomeObject extends any[]
  ? SomeObject[number]
  : never;

/**
 * Extracts the paths of the provided object that match the given type.
 *
 * @remarks By default, ExcludeOptional is false, so optional properties are included.
 *
 * @param SomeObject - The object to extract the property paths from.
 * @param Type - The type of the property paths to extract.
 * @param ExcludeOptional - Flag to exclude optional properties.
 *
 * @public
 */
export type ExtractPaths<SomeObject, Type, ExcludeOptional extends boolean = false> = {
  [Path in PropertyPath<SomeObject> as PropertyType<SomeObject, Path> extends (
    ExcludeOptional extends true ? Type : Type | undefined
  )
    ? Path
    : never]: Type;
};
