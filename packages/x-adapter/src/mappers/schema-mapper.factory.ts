import { deepMerge } from '@empathyco/x-deep-merge';
import {
  Dictionary,
  ExtractPath,
  isArray,
  isFunction,
  isObject,
  isPath,
  reduce
} from '@empathyco/x-utils';
import { Schema, SubSchemaTransformer } from '../schemas/types';
import { createMutableSchema, isInternalMethod } from '../schemas/utils';
import { extractValue } from '../utils/extract-value';
import { Mapper, MapperContext } from './types';

/**
 * The 'schemaMapperFactory' function creates a {@link Mapper | mapper function} for a given
 * {@link Schema | schema}.
 *
 * @param schema - The {@link Schema | schema} to apply in the {@link Mapper | mapper function}.
 * @returns A {@link Mapper | mapper function} that applies the given {@link Schema | schema}.
 * @public
 */
export function schemaMapperFactory<Source, Target>(
  schema: Schema<Source, Target>
): Mapper<Source, Target> {
  return function mapper(source: Source, context: MapperContext): Target {
    return mapSchema(source, schema, context);
  };
}

/**
 * The `mapSchema()` function creates a new object populated with the transformations defined by a
 * {@link Schema} applied to a source object.
 *
 * @param source - The object to apply the transformations to.
 * @param schema - The object that defines the transformations to apply.
 * @param context - The {@link MapperContext | mapper context} to feed the transformations with.
 * @returns A new object with each element being the result of the applied transformation.
 * @internal
 */
function mapSchema<Source, Target>(
  source: Source,
  schema: Schema<Source, Target>,
  context: MapperContext
): Target {
  if (!source) {
    //eslint-disable-next-line no-console
    console.warn('This schema cannot be applied', createMutableSchema(schema));
    return undefined as any;
  }
  return reduce(
    schema,
    (target, key, transformer) => {
      type TargetKey = Target[keyof Target];
      if (typeof transformer === 'string' && isPath(source, transformer)) {
        target[key] = extractValue(source, transformer) as TargetKey;
      } else if (isFunction(transformer) && !isInternalMethod(transformer.name)) {
        target[key] = transformer(source, context);
      } else if (isObject(transformer)) {
        const value =
          '$subSchema' in transformer
            ? (applySubSchemaTransformer<Source, TargetKey>(
                source,
                transformer as SubSchemaTransformer<Source, TargetKey>,
                context,
                schema as unknown as Schema<Source, TargetKey>
              ) as TargetKey)
            : mapSchema<Source, TargetKey>(source, transformer, context);

        if (value) {
          target[key] = value;
        }
      }
      return target;
    },
    {} as Target
  );
}

/**
 * The `applySubSchemaTransformer()` function executes a `mapSchema()` function applying the defined
 * {@link SubSchemaTransformer.$subSchema}.
 *
 * @param source - The object to feed the schema.
 * @param subSchemaTransformer - The {@link SubSchemaTransformer} object with a $path, $subSchema
 * and $context options.
 * @param subSchemaTransformer.$path
 * @param subSchemaTransformer.$subSchema
 * @param rawContext - The {@link MapperContext | mapper context} to feed the mapSchema function.
 * @param subSchemaTransformer.$context
 * @param schema - The {@link Schema} to apply.
 * @returns The result of calling `mapSchema()` with the source, schema and context arguments.
 * @internal
 */
function applySubSchemaTransformer<Source, Target>(
  source: Source,
  { $subSchema, $path, $context }: SubSchemaTransformer<Source, Target>,
  rawContext: MapperContext,
  schema: Schema<Source, Target>
): Target | Target[] | undefined {
  const subSource = extractValue(source, $path);

  if (!subSource) {
    return;
  }

  const extendedContext: Dictionary = {};
  if ($context) {
    Object.entries($context).forEach(([key, value]) => {
      if (['requestParameters', 'endpoint', 'mappedValue'].includes(key)) {
        return;
      }
      extendedContext[key] = isFunction(value)
        ? value(source)
        : extractValue(source, value as ExtractPath<typeof source>);
    });
  }

  const context = deepMerge({}, rawContext, $context, extendedContext);
  let subSchema: typeof $subSchema | typeof schema;
  if ($subSchema === '$self') {
    subSchema = schema;
  } else if (isFunction($subSchema)) {
    subSchema = $subSchema(source);
  } else {
    subSchema = $subSchema;
  }
  return isArray(subSource)
    ? subSource.map(item => mapSchema(item, subSchema, context) as Target)
    : mapSchema<typeof subSource, Target>(
        subSource,
        subSchema as Schema<typeof subSource, Target>,
        context
      );
}
