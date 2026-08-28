import type { Mapper, MapperContext } from './types'

/**
 * A schema-like object that has a `parse` method.
 * Accepts Zod schemas, ZodPipe (from .passthrough().transform()), etc.
 *
 * @public
 */
export interface ParseableSchema<T> {
  parse: (input: unknown) => T
}

/**
 * The `zSchemaMapperFactory` function creates a {@link Mapper | mapper function} from a
 * Zod schema that validates a Source and transforms it into a Target.
 *
 * The schema should be a `z.object().transform()` pipeline where:
 * - The `z.object()` validates the source shape
 * - The `.transform()` maps source fields to target fields
 *
 * @param schema - A Zod schema that parses Source and outputs Target via transform.
 * @returns A {@link Mapper | mapper function} that applies the given schema.
 * @public
 */
export function zSchemaMapperFactory<Source, Target>(
  schema: ParseableSchema<Target>,
): Mapper<Source, Target> {
  return function mapper(source: Source, _context: MapperContext): Target {
    return schema.parse(source)
  }
}

/**
 * The `createContextualMapperFactory` function creates a {@link Mapper | mapper function}
 * from a factory function that receives a {@link MapperContext} and returns a Zod schema.
 *
 * This is useful when the schema transformation depends on external context values
 * (e.g., `requestParameters`, `endpoint`, or custom context properties).
 *
 * @param factory - A function that receives {@link MapperContext} and returns a parseable schema.
 * @returns A {@link Mapper | mapper function} that applies the context-dependent schema.
 * @public
 */
export function createContextualMapperFactory<Source, Target>(
  factory: (context: MapperContext) => ParseableSchema<Target>,
): Mapper<Source, Target> {
  return function mapper(source: Source, context: MapperContext): Target {
    return factory(context).parse(source)
  }
}
