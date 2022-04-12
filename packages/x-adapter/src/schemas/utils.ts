import { deepMerge, replaceBehaviour } from '@empathyco/x-deep-merge';
import { MutableSchema, MutableSchemaMethods, Schema } from './schemas.types';

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
    [MutableSchemaMethods.Replace]: function <Source = any, Target = any>(
      newSchema: Schema<Source, Target>
    ) {
      deepMerge(this, replaceBehaviour(newSchema));
    },
    [MutableSchemaMethods.Override]: function <Source = any, Target = any>(
      newSchema: Schema<Source, Target>
    ) {
      deepMerge(this, newSchema);
    }
  };
}
