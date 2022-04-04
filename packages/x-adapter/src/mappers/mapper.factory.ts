import { deepMerge } from '@empathyco/x-deep-merge';
import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { ExtractPath, isFunction, isObject, reduce } from '@empathyco/x-utils';
import { Schema, SubSchemaTransformer } from '../schemas/schemas.types';
import { Mapper, MapperContext } from '../types/mapper.types';
import { extractValue } from '../utils/extract-value';

/**
 * The 'mapperFactory' function creates a {@link Mapper | mapper function} for a given
 * {@link Schema | schema}.
 *
 * @param schema - The {@link Schema | schema} to apply in the {@link Mapper | mapper function}.
 *
 * @returns A {@link Mapper | mapper function} that applies the given {@link Schema | schema}.
 *
 * @public
 */
export function mapperFactory<Source, Target>(
  schema: Schema<Source, Target>
): Mapper<Source, Target | undefined> {
  return function mapper(source: Source, context: MapperContext): Target | undefined {
    return mapSchema(source, schema, context);
  };
}

// TODO: Extract to x-utils
function isPath<SomeObject>(obj: SomeObject, path: string): path is ExtractPath<SomeObject> {
  return getSafePropertyChain(obj, path) !== undefined ? true : false;
}

/**
 * The `mapSchema()` function creates a new object populated with the transformations defined by a
 * {@link Schema} applied to a source object.
 *
 * @param source - The object to apply the transformations to.
 * @param schema - The object that defines the transformations to apply.
 * @param context - The {@link MapperContext | mapper context} to feed the transformations with.
 *
 * @returns A new object with each element being the result of the applied transformation.
 *
 * @internal
 */
function mapSchema<Source, Target>(
  source: Source,
  schema: Schema<Source, Target>,
  context: MapperContext
): Target | undefined {
  if (!source) {
    return undefined;
  }
  return reduce(
    schema,
    (target, key, transformer) => {
      if (typeof transformer === 'string') {
        if (isPath(source, transformer)) {
          target[key] = extractValue(source, transformer) as Target[typeof key];
        }
      } else if (isFunction(transformer)) {
        target[key] = transformer(source, context);
      } else if (isObject(transformer)) {
        if ('$subschema' in transformer) {
          const value = applySubSchemaTransformer<Source, Target[typeof key]>(
            source,
            transformer as SubSchemaTransformer<Source, Target[typeof key]>,
            context,
            schema as unknown as Schema<Source, Target[typeof key]>
          ) as Target[keyof Target];

          if (value) {
            target[key] = value;
          }
        } else {
          const value = mapSchema<Source, Target[typeof key]>(source, transformer, context);

          if (value) {
            target[key] = value;
          }
        }
      }
      return target;
    },
    {} as Target
  );
}

// TODO: Extract to x-utils
function isArrayOf<Type>(possibleArray: Type | Type[]): possibleArray is Type[] {
  return Array.isArray(possibleArray);
}

/**
 * The `applySubSchemaTransformer()` function executes a `mapSchema()` function applying the defined
 * {@link SubSchemaTransformer.$subschema}.
 *
 * @param source - The object to feed the schema.
 * @param subSchemaTransformer - The {@link SubSchemaTransformer} object with a $path, $subschema
 * and $context options.
 * @param rawContext - The {@link MapperContext | mapper context} to feed the mapSchema function.
 * @param schema - The {@link Schema} to apply.
 *
 * @returns The result of calling `mapSchema()` with the source, schema and context arguments.
 *
 * @internal
 */
function applySubSchemaTransformer<Source, Target>(
  source: Source,
  { $subschema, $path, $context }: SubSchemaTransformer<Source, Target>,
  rawContext: MapperContext,
  schema: Schema<Source, Target>
): Target | Target[] | undefined {
  const subSource = extractValue(source, $path);
  if (!subSource) {
    return undefined;
  }

  const context = deepMerge(rawContext, $context);
  if ($subschema === '$self') {
    if (isArrayOf(subSource)) {
      return subSource.map(item => mapSchema(item as Source, schema, context) as Target);
    } else {
      return mapSchema(subSource as Source, schema, context);
    }
  } else {
    if (isArrayOf(subSource)) {
      return subSource.map(item => mapSchema(item, $subschema, context) as Target);
    } else {
      return mapSchema(subSource, $subschema, context);
    }
  }
}
