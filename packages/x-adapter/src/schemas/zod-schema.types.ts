import type { MapperContext } from '../mappers/types'

/**
 * The result of validating a source object with a {@link SourceValidator}.
 *
 * @public
 */
export type SourceValidatorResult<Output> =
  | { success: true; data: Output }
  | { success: false; error: unknown }

/**
 * Minimal structural contract of a validator. Any [Zod](https://zod.dev) schema (`zod` or
 * `zod/mini`) satisfies it, so `@empathyco/x-adapter` does not need to depend on a concrete Zod
 * version.
 *
 * @param Output - The type of the validated source.
 * @public
 */
export interface SourceValidator<Output = unknown> {
  safeParse: (input: unknown) => SourceValidatorResult<Output>
}

/**
 * Definition of a {@link MutableZodSchema}.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 * @example
 * ```typescript
 * const userSchema = createMutableZodSchema({
 *   source: z.looseObject({ id: z.string(), price: z.object({ max: z.number() }) }),
 *   transform: (source): User => ({ identifier: source.id, maxPrice: source.price.max }),
 * })
 * ```
 * @public
 */
export interface ZodSchemaDefinition<Source, Target> {
  /**
   * Validator of the source object. When omitted the source is not validated and its type has
   * to be provided through the `Source` type parameter.
   */
  source?: SourceValidator<Source>
  /**
   * Maps the (validated) source object to the target object.
   *
   * @remarks The properties of the returned object whose value is `undefined` are not added to
   * the target.
   * @param source - The validated source object.
   * @param context - The {@link MapperContext | mapper context}.
   * @returns The target object.
   */
  transform: (source: Source, context: MapperContext) => Target
}

/**
 * Definition of a modification to apply on top of a {@link MutableZodSchema}.
 *
 * @param Source - The source object of the schema to modify.
 * @param Target - The target object of the schema to modify.
 * @param NewSource - The extra properties of the source object.
 * @param NewTarget - The extra properties of the target object.
 * @public
 */
export interface ZodSchemaOverride<Source, Target, NewSource, NewTarget> {
  /**
   * Validator for the extra properties of the source object. Its output is merged with the
   * output of the validators that the schema already has.
   */
  source?: SourceValidator<NewSource>
  /**
   * Maps the source object to the properties of the target to add or replace. The returned
   * object is shallow merged with the target mapped so far.
   *
   * @remarks The properties of the returned object whose value is `undefined` are ignored, so
   * they do not replace the ones already mapped.
   * @param source - The validated source object.
   * @param target - The target object mapped so far by the schema.
   * @param context - The {@link MapperContext | mapper context}.
   * @returns The properties to add or replace in the target object.
   */
  transform: (
    source: Source & NewSource,
    target: Target,
    context: MapperContext,
  ) => Partial<Target> & NewTarget
}

/**
 * A schema that maps a source object to a target object, optionally validating the source. It can
 * be modified after its creation to: partially override it, create a new one or completely replace
 * it.
 *
 * @remarks It replaces the deprecated {@link MutableSchema}, whose path based typings forced
 * TypeScript to recursively compute every possible path of the source object.
 * @param Source - The source object.
 * @param Target - The target object.
 * @public
 */
export interface MutableZodSchema<Source, Target> {
  /**
   * Validates the source object and maps it to the target object.
   *
   * @remarks Validation never breaks the mapping: if the source does not match the validators, a
   * warning is logged and the raw source is mapped.
   * @param source - The object to map.
   * @param context - The {@link MapperContext | mapper context} to feed the transformations with.
   * @returns The target object.
   */
  parse: (source: unknown, context?: MapperContext) => Target
  /**
   * Modifies this schema, so every usage of it applies the given modification.
   *
   * @param override - The validator and the transformation to apply on top of this schema.
   * @returns This schema.
   */
  $override: <NewSource = unknown, NewTarget = unknown>(
    override: ZodSchemaOverride<Source, Target, NewSource, NewTarget>,
  ) => MutableZodSchema<Source & NewSource, Target & NewTarget>
  /**
   * Creates a new schema using this one as starting point. This schema remains unchanged.
   *
   * @param override - The validator and the transformation to apply on top of this schema.
   * @returns The new schema.
   */
  $extends: <NewSource = unknown, NewTarget = unknown>(
    override: ZodSchemaOverride<Source, Target, NewSource, NewTarget>,
  ) => MutableZodSchema<Source & NewSource, Target & NewTarget>
  /**
   * Replaces all usages of this schema with the given definition.
   *
   * @param definition - The definition to use instead of the current one.
   * @returns This schema.
   */
  $replace: <NewSource, NewTarget>(
    definition: ZodSchemaDefinition<NewSource, NewTarget>,
  ) => MutableZodSchema<NewSource, NewTarget>
}
