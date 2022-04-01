/**
 * TypeScript type primitives. Basically every type possible except objects or arrays.
 *
 * @public
 */
export type Primitive = string | number | boolean | bigint | undefined | null | symbol;

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
