import { Identifiable, NamedModel } from '@empathyco/x-types';
import { XEventsTypes } from '../wiring/events.types';
import { XModuleName } from '../x-modules/x-modules.types';

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
  [P in keyof T]?: T[P] extends NonPrimitive
    ? T[P] extends AnyFunction
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

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
export type Primitive = string | number | boolean | undefined | null | symbol | AnyFunction;

/**
 * A function with 0 or more parameters of any type, which can return something or not.
 *
 * @public
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * A function with no parameters that can return anything.
 *
 * @public
 */
export type NiladicFunction = () => any;

/**
 * A function with a single parameter that can return anything.
 *
 * @public
 */
export type MonadicFunction = (someParam: any) => any;

/**
 * Alias to retrieve the first parameter type of a function.
 *
 * @public
 */
export type FirstParameter<SomeFunction extends AnyFunction> = Parameters<SomeFunction>[0];

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
export type VueCSSClasses = string | Dictionary<boolean> | (string | Dictionary<boolean>)[];

/**
 * Represents a pair of values of the same type in an array.
 *
 * @public
 */
export type Pair<Type> = [Type, Type];

/**
 * Represents when to take control of the navigation.
 *
 * @remarks
 * The {@link XEvent} refers to the event the component has to listen to.
 *
 * @public
 */
export type TakeNavigationControl = {
  xEvent: PropsWithType<XEventsTypes, ArrowKey>;
  moduleName: XModuleName;
  direction: ArrowKey;
};

/**
 * Events to emit when reaching the {@link ArrowKey | direction} limit.
 *
 * @public
 */
export type EventsForDirectionLimit = {
  [key in ArrowKey]: PropsWithType<XEventsTypes, void>;
};

/**
 * Type representing a grid item. It has to be an
 * {@link @empathyco/x-types#Identifiable | Identifiable} object that can optionally contain a
 * {@link @empathyco/x-types#NamedModel.modelName | modelName}.
 *
 * @public
 */
export type ListItem = Identifiable & NamedModel;

/**
 * The type returned by the {@link debounce} function. Basically is the function the
 * {@link debounce} receives but debounced and with a method `cancel()` to cancel pending timeouts.
 *
 * @param Params - The arguments type of the function.
 *
 * @public
 */
export interface DebouncedFunction<Params extends any[]> {
  (...args: Params): void;
  cancel(): void;
}

/**
 * Debounce options for the strategies that the debounce would use.
 *
 * @public
 */
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * The type returned by the {@link throttle} function. Basically is the function the
 * {@link throttle} receives but throttled.
 *
 * @param Params - The arguments type of the function.
 *
 * @public
 */
export interface ThrottleFunction<Params extends any[]> {
  (...args: Params): void;
}

/**
 * Alias for a type that might be an array or not.
 */
export type MaybeArray<Something> = Something | Array<Something>;
