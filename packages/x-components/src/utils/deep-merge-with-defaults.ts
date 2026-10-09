import type { DeepPartial } from '@empathyco/x-utils'
import { isObject } from '@empathyco/x-utils'

/**
 * Deeply merges `overrides` onto `defaults` at any depth, so nested objects can be overridden
 * partially without losing the rest of the default configuration:
 *
 * - The keys of `defaults` define the shape of the result: keys that do not exist in `defaults`
 *   are ignored.
 * - An `undefined` entry in `overrides` keeps the default value.
 * - When both the default and the override are plain objects, they are merged recursively.
 * - Any other value (string, function, array, `null`...) in `overrides` replaces the default.
 *
 * Neither input is mutated.
 *
 * @example
 * ```ts
 * const defaults = { a: { b: { c: 1, d: 2 }, e: 'keep' }, f: () => 'x' }
 * deepMergeWithDefaults(defaults, { a: { b: { c: 10 } } })
 * // → { a: { b: { c: 10, d: 2 }, e: 'keep' }, f: () => 'x' }
 * ```
 *
 * @param defaults - The base object. It provides the result shape and the fallback values.
 * @param overrides - The values that win over the defaults at each leaf.
 * @returns A new object with the same shape as `defaults`.
 *
 * @public
 */
export function deepMergeWithDefaults<T extends object>(
  defaults: T,
  overrides?: DeepPartial<T>,
): T {
  const result: Record<string, unknown> = {}
  const overrideEntries = overrides as Record<string, unknown> | undefined
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const overrideValue = overrideEntries?.[key]
    if (overrideValue === undefined) {
      result[key] = defaultValue
    } else if (isObject(defaultValue) && isObject(overrideValue)) {
      result[key] = deepMergeWithDefaults(defaultValue, overrideValue)
    } else {
      result[key] = overrideValue
    }
  }
  return result as T
}
