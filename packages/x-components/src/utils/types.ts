/**
 * Object where all its properties are strings, and the value of them is defined by the type of the T property
 * @param T the type of the properties of the object
 */
export type Dictionary<T = any> = Record<string, T>;

/**
 * Extracts the name of the properties of an object that match a type
 * @param Type the object type from whom extract the properties names
 * @param PropType the type of the properties to select
 * @example ```typescript`
 *  interface Person {
 *    name: string,
 *    surname: string,
 *    age: number
 *  }
 *
 *  type StringPersonProperties = PropsWithType<Person, string>; // "name" | "surname";
 * ``
 */
export type PropsWithType<Type, PropType> = {
  [Key in keyof Type]: Type[Key] extends PropType ? Key : never;
}[keyof Type];

/**
 * Makes all the properties of the T type optional in depth
 * @param T the type to make all its properties in depth optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Primitive ? T[P] : DeepPartial<T[P]>;
};

/**
 * TypeScript type primitives. Basically every type possible except objects or arrays.
 */
export type Primitive = string | number | boolean | undefined | null | symbol | AnyFunction;

/**
 * A function with 0 or more parameters of any type, which can return something or not
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Extracts the return type of each property of the T object
 * @param T the dictionary of functions to extract its return type
 */
export type Returns<T extends Dictionary<AnyFunction>> = {
  [K in keyof T]: ReturnType<T[K]>;
};

/**
 * Creates a decorator that will only work for properties of the type passed. The decorator will only work if the property is public
 * @param Type - The type of the properties that are allowed to be decorated
 */
export type DecoratorFor<Type> = <Key extends string, Target extends Record<Key, Type>>(
  target: Target,
  key: Key
) => void;
