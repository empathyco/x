import type { MapperContext, TransformSchema } from '@empathyco/x-adapter'

/**
 * Removes the `undefined` properties of an object, so the target only contains the properties
 * that the source has. This is how the path transformers of the deprecated schemas behaved.
 *
 * @param object - The object to clean.
 * @returns A new object without the `undefined` properties.
 * @internal
 */
export function defined<T>(object: { [Key in keyof T]: T[Key] | undefined }): T {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined)) as T
}

/**
 * Maps each item of a list with the given schema.
 *
 * @param schema - The schema to apply to each item.
 * @param items - The list of items to map.
 * @param context - The {@link MapperContext | mapper context}.
 * @returns The list of mapped items, or `undefined` if there is no list.
 * @internal
 */
export function parseEach<Target>(
  schema: TransformSchema<any, Target>,
  items: unknown[] | undefined | null,
  context: MapperContext,
): Target[] | undefined {
  return Array.isArray(items) ? items.map(item => schema.parse(item, context)) : undefined
}
