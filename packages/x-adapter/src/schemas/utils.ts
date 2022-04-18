import { deepMerge, replaceBehaviour } from '@empathyco/x-deep-merge';
import { MutableSchema, Schema } from './schemas.types';

/**
 * Collection of internal method names for {@link MutableSchema | mutable schemas}.
 */
export const mutableSchemasInternalMethods = ['$replace', '$override'];

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
    $replace: function <Source = any, Target = any>(newSchema: Schema<Source, Target>) {
      Object.keys(this).forEach(key => {
        if (isInternalMethod(key)) {
          return;
        }
        delete this[key];
      });
      deepMerge(this, replaceBehaviour(newSchema));
    },
    $override: function <Source = any, Target = any>(newSchema: Schema<Source, Target>) {
      deepMerge(this, newSchema);
    }
  };
}

/**
 * Checks if the given name refers to an internal method of a {@link MutableSchema | mutableSchema}.
 *
 * @param name - The property name to check.
 *
 * @returns True if it is an internal method of a {@link MutableSchema | mutableSchema},
 * false otherwise.
 */
export function isInternalMethod(name: string): boolean {
  return mutableSchemasInternalMethods.includes(name);
}
