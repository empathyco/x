import type { MapperContext } from '../mappers/types'
import type {
  SourceValidator,
  TransformSchema,
  TransformSchemaDefinition,
  TransformSchemaOverride,
} from './transform-schema.types'

/** A step of the mapping: an optional validator plus the transformation to merge. */
interface Layer {
  source?: SourceValidator
  transform: (source: any, target: any, context: MapperContext) => unknown
}

/** Max number of different validation warnings that a schema reports. */
const MAX_REPORTED_ISSUES = 20

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function merge(base: unknown, value: unknown): unknown {
  return isPlainObject(base) && isPlainObject(value) ? { ...base, ...value } : value
}

/**
 * Removes the `undefined` properties of a mapped object. This way a transformation never adds
 * properties that the source does not have, nor replaces already mapped ones with `undefined`.
 */
function clean(value: unknown): unknown {
  return isPlainObject(value)
    ? Object.fromEntries(Object.entries(value).filter(([, property]) => property !== undefined))
    : value
}

function createSchema(layers: Layer[]): TransformSchema<any, any> {
  const reportedIssues = new Set<string>()

  function validate(validator: SourceValidator, source: unknown): unknown {
    const result = validator.safeParse(source)
    if (result.success) {
      return result.data
    }
    const message = result.error instanceof Error ? result.error.message : String(result.error)
    if (!reportedIssues.has(message) && reportedIssues.size < MAX_REPORTED_ISSUES) {
      reportedIssues.add(message)
      console.warn('[x-adapter] The source does not match the schema', result.error, source)
    }
    return source
  }

  return {
    parse(source, context = {}) {
      if (source === undefined || source === null) {
        console.warn('[x-adapter] This schema cannot be applied to an empty source')
        return undefined
      }
      // The raw source is the base, so validators that strip unknown keys do not lose data.
      const validated = layers.reduce<unknown>(
        (data, layer) => (layer.source ? merge(data, validate(layer.source, source)) : data),
        source,
      )
      return layers.reduce<unknown>(
        (target, layer) => merge(target, clean(layer.transform(validated, target, context))),
        undefined,
      )
    },
    $override(override: TransformSchemaOverride<any, any, any, any>) {
      layers.push(override)
      return this
    },
    $extends(override: TransformSchemaOverride<any, any, any, any>) {
      return createSchema([...layers, override])
    },
    $replace(definition: TransformSchemaDefinition<any, any>) {
      layers.splice(0, layers.length, toLayer(definition))
      reportedIssues.clear()
      return this
    },
  }
}

function toLayer({ source, transform }: TransformSchemaDefinition<any, any>): Layer {
  return { source, transform: (data, _target, context) => transform(data, context) }
}

/**
 * Creates a {@link TransformSchema} that maps a source object to a target object with a plain
 * function. Optionally, the source can be validated with a [Zod](https://zod.dev) schema.
 *
 * @param definition - The validator and the transformation of the schema.
 * @returns A {@link TransformSchema}.
 * @example
 * ```typescript
 * const resultSchema = createTransformSchema<ApiResult, Result>({
 *   transform: source => ({ id: source.__id, name: source.__name }),
 * })
 *
 * // With a validator the types of the source are inferred from it.
 * resultSchema.$override({
 *   source: z.looseObject({ brand: z.string() }),
 *   transform: source => ({ brand: source.brand }),
 * })
 * ```
 * @public
 */
export function createTransformSchema<Source, Target>(
  definition: TransformSchemaDefinition<Source, Target>,
): TransformSchema<Source, Target> {
  return createSchema([toLayer(definition)])
}

/**
 * Checks if the given schema is a {@link TransformSchema}.
 *
 * @param schema - The schema to check.
 * @returns True if it is a {@link TransformSchema}, false otherwise.
 * @public
 */
export function isTransformSchema(schema: unknown): schema is TransformSchema<any, any> {
  return isPlainObject(schema) && '$override' in schema && '$extends' in schema
}
