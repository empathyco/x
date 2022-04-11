import { deepMerge } from '@empathyco/x-deep-merge';
import { MutableSchema, Schema } from './schemas.types';

/**
 * Creates a {@link MutableSchema | mutable schema } version of a given {@link Schema | schema}.
 *
 * @param schema - The {@link Schema | schema} to make mutable.
 *
 * @returns A {@link MutableSchema | mutable schema} version of the given {@link Schema | schema}.
 *
 * @public
 */
export function makeSchemaMutable<T extends Schema>(schema: T): MutableSchema<T> {
  return {
    ...schema,
    replace: <ReplaceSchema extends Schema>(newSchema: ReplaceSchema) =>
      Object.assign(schema, newSchema),
    override: <OverrideSchema extends Schema>(newSchema: OverrideSchema) =>
      deepMerge(schema, newSchema)
  };
}
