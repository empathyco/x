/**
 * Object where all its properties are strings, and the value of them is defined by the type of
 * the T property.
 *
 * @param T - The type of the properties of the object.
 * @public
 */
export type Dictionary<T = any> = Record<string, T>;

/**
 * Extracts the name of the properties of an object that match a type.
 *
 * @param Type - The object type from whom extract the properties names.
 * @param PropType - The type of the properties to select.
 * @example
 * ```typescript
 *   interface Person {
 *   name: string,
 *   surname: string,
 *   age: number
 * }
 *
 *  type StringPersonProperties = PropsWithType<Person, string>; // "name" | "surname";
 * ```
 * @public
 */
export type PropsWithType<Type, PropType> = {
  [Key in keyof Type]: Type[Key] extends PropType ? Key : never;
}[keyof Type];

/**
 * Makes all the properties of the T type optional in depth.
 *
 * @param T - The type to make all its properties in depth optional.
 * @public
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Primitive ? T[P] : DeepPartial<T[P]>;
};

/**
 * TypeScript type primitives. Basically every type possible except objects or arrays.
 *
 * @public
 */
export type Primitive = string | number | boolean | undefined | null | symbol | AnyFunction;

/**
 * A function with 0 or more parameters of any type, which can return something or not.
 *
 * @public
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Extracts the return type of each property of the T object.
 *
 * @param T - The dictionary of functions to extract its return type.
 * @public
 */
export type Returns<T extends Dictionary<AnyFunction>> = {
  [K in keyof T]: ReturnType<T[K]>;
};

/**
 * Creates a decorator that will only work for properties of the type passed. The decorator will
 * only work if the property is public.
 *
 * @param Type - The type of the properties that are allowed to be decorated.
 * @public
 */
export type DecoratorFor<Type> = <Key extends string, Target extends Record<Key, Type>>(
  target: Target,
  key: Key
) => void;

/**
 * Union type containing the existing arrow keys.
 *
 * @public
 */
export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowRight' | 'ArrowLeft';

/**
 * Union type containing supported Vue dynamic classes.
 *
 * @public
 */
export type VueCssClasses = string | Dictionary<boolean> | (string | Dictionary<boolean>)[];
