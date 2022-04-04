import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { ExtractPath, ExtractType } from './types/paths.types';
import { AnyFunction } from './types/utils.types';

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

/**
 * Determines whether the passed path is a valid property path of the passed object.
 *
 * @param obj - The object to check the path against.
 * @param path - The path to be checked.
 *
 * @returns `true` if `path` is a valid path of `obj`; otherwise, `false`.
 *
 * @public
 */
export function isPath<SomeObject, Path extends ExtractPath<SomeObject>>(
  obj: SomeObject,
  path: string
): path is Path {
  return getSafePropertyChain<ExtractType<SomeObject, Path>>(obj, path) !== undefined
    ? true
    : false;
}
