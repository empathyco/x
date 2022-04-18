import { deepMerge } from '@empathyco/x-deep-merge';
import { MutableSchema, Schema } from './schemas.types';

/**
 * Collection of internal method names for {@link MutableSchema | mutable schemas}.
 */
export const mutableSchemasInternalMethods = ['$replace', '$override', '$extends', '$toString'];

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
    $replace: function <Source = any, Target = any>(
      newSchema: Schema<Source, Target>
    ): MutableSchema<Schema<Source, Target>> {
      Object.keys(this).forEach(key => {
        if (isInternalMethod(key)) {
          return;
        }
        delete this[key];
      });
      Object.assign(this, newSchema);
      return this;
    },
    $override: function <Source = any, Target = any>(
      newSchema: Schema<Source, Target>
    ): MutableSchema<Schema<Source, Target>> {
      return deepMerge(this, newSchema);
    },
    $extends: function <Source = any, Target = any>(
      newSchema: Schema<Source, Target>
    ): MutableSchema<Schema<Source, Target>> {
      return deepMerge({}, this, newSchema);
    },
    $toString: function (includeInternalMethods = false) {
      return serialize(this, includeInternalMethods);
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

/**
 * Returns a string representing of the given object.
 *
 * @param data - The object to get the string representation from.
 * @param includeInternalMethods - Flag to include in the string representation
 * the internal methods. Disabled by default.
 * @returns The string representation.
 */
function serialize(data: Record<string, unknown>, includeInternalMethods: boolean): string {
  let output = '';
  if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object') {
        output += ` ${key}: { \n ${serialize(
          data[key] as Record<string, unknown>,
          includeInternalMethods
        )} } \n`;
      } else if (typeof data[key] === 'function') {
        if (isInternalMethod(key) && !includeInternalMethods) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        output += ` ${key}: ${data[key]} \n`;
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        output += `${key}: ${data[key]} \n`;
      }
    });
  }
  return output;
}
