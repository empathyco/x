/**
 * A function with 0 or more parameters of any type, which can return something or not.
 *
 * @public
 */
export type AnyFunction = (...args: any[]) => any;
/**
 * TypeScript type non-primitives. Array or Record with all possible types.
 *
 * @public
 */
export type NonPrimitive = Array<any> | Record<any, any>;

/**
 * TypeScript type primitives. Basically every type possible except objects or arrays.
 *
 * @public
 */
export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | undefined
  | null
  | symbol
  | AnyFunction;

/**
 * Retrieves the keys of a determinate type from a provided interface.
 *
 * @param SomeObject - The object to extract the keys from.
 * @param Type - The type of the keys to be extracted.
 *
 * @internal
 */
export type Keys<SomeObject, Type> = Extract<keyof SomeObject, Type>;

/**
 * Object where all its properties are strings, and the value of them is defined by the type of
 * the T property.
 *
 * @param T - The type of the properties of the object.
 * @public
 */
export type Dictionary<T = any> = Record<string, T>;

/**
 * Makes all the properties of the T type optional in depth.
 *
 * @param T - The type to make all its properties in depth optional.
 * @public
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends NonPrimitive
    ? T[P] extends AnyFunction
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};
