import { Keys, Primitive } from './utils.types';

/**
 * Extracts all the possible string paths to properties for a given object.
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
 *  type ResultPropertyPaths = ExtractPropertyPath<Result>;
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
export type ExtractPropertyPath<SomeObject> = SomeObject extends (infer ArrayType)[]
  ? `${number}` | `${number}.${ExtractPropertyPath<ArrayType>}`
  : Keys<SomeObject, string> | ExtractNestedPropertyPath<SomeObject, Keys<SomeObject, string>>;

/**
 * String path for child properties from a given object.
 *
 * @param SomeObject - The object type to extract the properties names from.
 * @param PropName - Name of the property to get the path from.
 *
 * @internal
 */
type ExtractNestedPropertyPath<
  SomeObject,
  PropName extends string
> = PropName extends keyof SomeObject
  ? // eslint-disable-next-line max-len
    SomeObject[PropName] extends SomeObject // Check that a child property is not from the same type as the parent to avoid infinite loops on recursive types
    ? `${PropName}.${Keys<SomeObject[PropName], string>}${any}`
    : // eslint-disable-next-line max-len
    SomeObject[PropName] extends SomeObject[] // Check that a child property is not from the same type as the parent to avoid infinite loops on recursive types
    ? `${PropName}.${number}` | `${PropName}.${number}.${Keys<SomeObject, string>}${any}`
    : // eslint-disable-next-line @typescript-eslint/ban-types
      `${PropName}.${ExtractPropertyPath<Exclude<SomeObject[PropName], Function | Primitive>>}`
  : never;

/**
 * Extracts the property type for the given path from the provided object.
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
 *  type MaxPrice = ExtractPropertyType<Result, "price.max">; // number
 *  type FirstImageType = ExtractPropertyType<Result, "images.0">; // string
 * ```
 *
 * @public
 */
export type ExtractPropertyType<
  SomeObject,
  Path extends ExtractPropertyPath<SomeObject>
> = Path extends keyof SomeObject
  ? SomeObject[Path]
  : Path extends `${infer Property}.${infer RemainingPath}`
  ? ExtractPropertyType<
      SomeObject[keyof SomeObject & Property],
      ExtractPropertyPath<SomeObject[keyof SomeObject & Property]> & RemainingPath
    >
  : SomeObject extends any[]
  ? SomeObject[number]
  : never;

/**
 * Extracts the property paths of the provided object that match the given type.
 *
 * @param SomeObject - The object to extract the property paths from.
 * @param Type - The type of the property paths to extract.
 *
 * @example
 * ```typescript
 * interface Result {
 *   id: string,
 *   price: {
 *     max: number,
 *     min: number,
 *     symbol: string;
 *   },
 *   images: string[]
 * }
 *
 * type StringPaths = ExtractPropertyPathsByType<Result, string>[];
 * // ['id', 'price.symbol', 'images']
 * type NumberPaths = ExtractPropertyPathsByType<Result, number>[];
 * // ['price.max', 'price.min']
 * ```
 * @public
 */
export type ExtractPropertyPathsByType<SomeObject, Type> = keyof {
  [Path in ExtractPropertyPath<SomeObject> as ExtractPropertyType<
    SomeObject,
    Path
  > extends (infer ArrayType)[]
    ? ArrayType extends Type
      ? Path
      : never
    : ExtractPropertyType<SomeObject, Path> extends Type
    ? Path
    : never]: any;
};
