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
 * TypeScript type non-primitives. Array or Record with all possible types.
 *
 * @public
 */
export type NonPrimitive = Array<any> | Record<any, any>;

/**
 * A function with 0 or more parameters of any type, which can return something or not.
 *
 * @public
 */
export type AnyFunction = (...args: any[]) => any;
