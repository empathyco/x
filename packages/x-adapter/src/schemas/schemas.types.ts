import {
  AnyFunction,
  ExtractPath,
  ExtractPathByType,
  ExtractType,
  Primitive
} from '@empathyco/x-utils';
import { MapperContext } from '../types/index';

// TODO: EX-5830 - Enhance Schema type to support optional properties in the Source object
/**
 * Template object to transform a source object to a target object.
 *
 * @remarks The source object must not have optional properties, as it could cause infinite
 * type instantiations.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 *
 * @example
 * ```typescript
 *  interface Source {
 *     id: string;
 *     price: {
 *       max: number;
 *       min: number;
 *     };
 *     images: string[];
 *   }
 *
 *   interface Target {
 *     identifier: string;
 *     maxPrice: number;
 *     minPrice: number;
 *     img: string[]
 *   }
 *
 *   const schema: Schema<Source, Target> = {
 *     identifier: 'id',
 *     maxPrice: 'price.max',
 *     minPrice: ({ price }) => Math.min(0, price.min),
 *     img: 'images'
 *   };
 * ```
 * @public
 */
export type Schema<Source = any, Target = any> = {
  [TargetKey in keyof Target]: SchemaTransformer<Source, Target, TargetKey>;
};

/**
 * The possible transformers to apply to the target key.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 * @param TargetKey - The target key to apply the transformation.
 *
 * @public
 */
export type SchemaTransformer<Source, Target, TargetKey extends keyof Target> =
  | PathTransformer<Source, Target[TargetKey]>
  | FunctionTransformer<Source, Target[TargetKey]>
  | SubSchemaTransformer<Source, Target[TargetKey]>
  | Schema<Source, Exclude<Target[TargetKey], AnyFunction | Primitive>>;

/**
 * A function with the source object and mapper context as parameters that returns the value of a
 * target's property.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 *
 * @example
 * ```typescript
 *  interface Source {
 *     id: string;
 *     count: number;
 *   }
 *
 *   interface Target {
 *     title: string;
 *     hits: number;
 *   }
 *
 *   const subSchema: Schema<Source, Target> = {
 *     title: 'id',
 *     hits: 'count'
 *   };
 *
 *   const wrongSubSchema: Schema<Source, Target> = {
 *     // @ts-expect-error
 *     title: 'count', // This raises a TS error
 *     hits: 'count'
 *   };
 * ```
 *
 * @public
 */
export type PathTransformer<Source, Target> = ExtractPathByType<Source, Target>;

/**
 * A function with the source object and mapper context as parameters that returns the value of a
 * target's property.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 *
 * @example
 * ```typescript
 *  interface Source {
 *     id: string;
 *     count: number;
 *   }
 *
 *   interface Target {
 *     title: string;
 *     hits: number;
 *   }
 *
 *   const subSchema: Schema<Source, Target> = {
 *     title: source => source.id,
 *     hits: (source, context) => context.requestParameters.query === 'example'
 *      ? source.count
 *      : 0
 *   };
 * ```
 *
 * @public
 */
export type FunctionTransformer<Source, Target> = (
  source: Source,
  context?: MapperContext
) => Target;

/**
 * An object containing a schema narrowing its source object based on the given path.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 *
 * @example
 * ```typescript
 *  interface Source {
 *     id: string;
 *     facets: {
 *       name: string;
 *       count: number;
 *     };
 *     images: string[];
 *   }
 *
 *   interface Target {
 *     identifier: string;
 *     filters: {
 *       id: string;
 *       numFound: number;
 *     };
 *     img: string[]
 *   }
 *
 *   const subSchema: SubSchemaTransformer<Source, Target['filters']> = {
 *     $path: 'facets',
 *     $subSchema: {
 *       id: 'name',
 *       numFound: 'count'
 *     }
 *   };
 * ```
 *
 * @public
 */
export type SubSchemaTransformer<Source, Target> = {
  [Path in ExtractPath<Source>]: {
    $context?: MapperContext;
    $path: Path;
    $subSchema:
      | (ExtractType<Source, Path> extends (infer SourceArrayType)[]
          ? Target extends (infer TargetArrayType)[]
            ? Schema<SourceArrayType, TargetArrayType>
            : never
          : Target extends (infer TargetArrayType)[]
          ? never
          : Schema<ExtractType<Source, Path>, Target>)
      | '$self';
  };
}[ExtractPath<Source>];

export type MutableSchema<S extends Schema> = S & {
  replace: <ReplaceSchema extends Schema>(newSchema: ReplaceSchema) => ReplaceSchema;
  override: <OverrideSchema extends Schema>(newSchema: OverrideSchema) => OverrideSchema;
};
