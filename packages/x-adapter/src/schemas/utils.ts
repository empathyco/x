import { deepMerge } from '@empathyco/x-deep-merge';
import { forEach, isFunction, isObject } from '@empathyco/x-utils';
import { MutableSchema, Schema } from './types';

/**
 * Collection of internal method names for {@link MutableSchema | mutable schemas}.
 */
const mutableSchemasInternalMethods = ['$replace', '$override', '$extends', 'toString'];

/**
 * Creates a {@link MutableSchema | mutable schema } version of a given {@link Schema | schema}.
 *
 * @param schema - The {@link Schema | schema} to make mutable.
 *
 * @returns A {@link MutableSchema | mutable schema} version of the given {@link Schema | schema}.
 *
 * @public
 */
export function createMutableSchema<T extends Schema>(schema: T): MutableSchema<T> {
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
    toString: function (includeInternalMethods = false) {
      return serialize(this, !!includeInternalMethods);
    }
  };
}

/**
 * Checks if the given key is a {@link MutableSchema | mutableSchema} method.
 *
 * @param name - The key to check.
 *
 * @returns True if it is a {@link MutableSchema | mutableSchema} method,
 * false otherwise.
 *
 * @public
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
 * @param deep - The level of indentation.
 * @returns The string representation.
 */
function serialize(
  data: Record<string, unknown>,
  includeInternalMethods: boolean,
  deep = 0
): string {
  const indentation = '  '.repeat(deep);
  let output = '';
  forEach(data, (key, value) => {
    if (isObject(value)) {
      output += `${indentation}${key}: {\n${serialize(
        value,
        includeInternalMethods,
        ++deep
      )}${indentation}},\n`;
    } else if (!isFunction(value) || !isInternalMethod(key) || includeInternalMethods) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      output += `${indentation}${key}: ${value},\n`;
    }
  });
  return output;
}
