import { AnyFunction } from './types/utils.types';

/**
 * Determines whether the passed value is an Array.
 *
 * @remarks It can be used to narrow the Array's type passing the desired type to the generic.
 *
 * @param value - The value to be checked.
 *
 * @returns True if the value is an Array; otherwise, false.
 *
 * @public
 */
export function isArray<Type>(value: Type | Type[]): value is Type[] {
  return Array.isArray(value);
}

/**
 * Determines whether the passed value is a Function.
 *
 * @param value - The value to be checked.
 *
 * @returns True if the value is a Function; otherwise, false.
 *
 * @public
 */
export function isFunction(value: any): value is AnyFunction {
  return Boolean(value) && typeof value === 'function';
}

/**
 * Determines whether the passed value is an Object.
 *
 * @param value - The value to be checked.
 *
 * @returns True if the value is an Object; otherwise, false.
 *
 * @public
 */
export function isObject(value: any): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
