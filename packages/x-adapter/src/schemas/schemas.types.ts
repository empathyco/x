import { PropertyPath, PropertyType, Primitive } from '@empathyco/x-utils';
import { MapperContext } from '../types/index';

/**
 * Template object to transform a source object to a target object.
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
 * All the possible properties to map a schema property into.
 *
 * @param Source - The source object.
 * @param Target - The target object.
 * @param TargetKey - The target key to apply the transformation.
 *
 * @public
 */
export type SchemaTransformer<Source, Target, TargetKey extends keyof Target> =
  | ExtractPathByType<Source, Target[TargetKey]>
  | ((source: Source, context?: MapperContext) => Target[TargetKey])
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Schema<Source, Exclude<Target[TargetKey], Function | Primitive>>
  | SubSchema<Source, Target[TargetKey]>;

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
 *   const subSchema: Schema<Source['facets'], Target['filters']> = {
 *     $path: 'facets',
 *     $subschema: {
 *       id: 'name',
 *       numFound: 'count'
 *     }
 *   };
 * ```
 *
 * @public
 */
type SubSchema<Source, Target> = {
  [Path in PropertyPath<Source>]: {
    $context?: MapperContext;
    $path: Path;
    $subschema?: Schema<PropertyType<Source, Path>, Target> | '$self';
  };
}[PropertyPath<Source>];

// TODO: Remove type after merging EX-5763
export type ExtractPathByType<SomeObject, Type> = keyof {
  [Path in PropertyPath<SomeObject> as PropertyType<SomeObject, Path> extends (infer ArrayType)[]
    ? ArrayType extends Type
      ? `${Path}.${number}`
      : never
    : PropertyType<SomeObject, Path> extends Type
    ? Path
    : never]: any;
};
