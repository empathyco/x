import type { TransformSchema } from '../schemas/transform-schema.types'
import type { Mapper, MapperContext } from './types'
import { isTransformSchema } from '../schemas/transform-schema'

/**
 * A schema-like object that has a `parse` method that throws if the input is not valid, like
 * any Zod schema: `z.object()`, `z.object().transform()`...
 *
 * @public
 */
export interface ParseableSchema<Target> {
  parse: (input: unknown) => Target
}

/**
 * The `transformSchemaMapperFactory` function creates a {@link Mapper | mapper function} for a given
 * {@link TransformSchema} or a raw Zod schema.
 *
 * @remarks A {@link TransformSchema} receives the {@link MapperContext | mapper context} and
 * never throws on invalid sources. A raw Zod schema is strict: it throws if the source is not
 * valid.
 * @param schema - The schema to apply in the {@link Mapper | mapper function}.
 * @returns A {@link Mapper | mapper function} that applies the given schema.
 * @public
 */
export function transformSchemaMapperFactory<Source, Target>(
  schema: TransformSchema<any, Target> | ParseableSchema<Target>,
): Mapper<Source, Target> {
  return function mapper(source: Source, context: MapperContext): Target {
    return isTransformSchema(schema) ? schema.parse(source, context) : schema.parse(source)
  }
}
