/**
 * Retrieves the keys of a determinate type from a provided interface.
 *
 * @param SomeObject - The object to extract the keys from.
 * @param Type - The type of the keys to be extracted.
 *
 * @internal
 */
type Keys<SomeObject, Type> = Extract<keyof SomeObject, Type>;

/**
 * TypeScript type primitives. Basically every type possible except objects or arrays.
 *
 * @public
 */
export type Primitive = string | number | boolean | bigint | undefined | null | symbol;

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
 *
 * @public
 */
export type PropertyPath<SomeObject> = SomeObject extends (infer ArrayType)[]
  ?
      | `${number}`
      | `${number}.${PropertyPath<ArrayType>}`
      | NestedPropertyPath<SomeObject, Keys<SomeObject, `${number}`>>
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
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    `${PropName}.${PropertyPath<Exclude<SomeObject[PropName], Function | Primitive>>}`
  : never;

/**
 * Retrieves type of a property for the given path from the provided object.
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
 *  type FirstImageType = PropertyType<Result, "image.0">; // string
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
  ? Property extends keyof SomeObject
    ? RemainingPath extends PropertyPath<NonNullable<SomeObject[Property]>>
      ? PropertyType<NonNullable<SomeObject[Property]>, RemainingPath>
      : never
    : SomeObject extends (infer ArrayType)[]
    ? RemainingPath extends PropertyPath<ArrayType>
      ? PropertyType<ArrayType, RemainingPath>
      : never
    : never
  : SomeObject extends (infer ArrayType)[]
  ? ArrayType
  : never;
