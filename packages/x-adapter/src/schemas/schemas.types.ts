import { PropertyPath, PropertyType, Primitive } from '@empathyco/x-utils';
import { MapperContext } from '../types/index';

/**
 *
 *
 * @public
 */
export type Schema<Source = any, Target = any> = {
  [TargetKey in keyof Target]: SchemaTransformer<Source, Target, TargetKey>;
};

/**
 *
 *
 * @public
 */
export type SchemaTransformer<Source, Target, TargetKey extends keyof Target> =
  | keyof ExtractPathsOfType<TreeShakeObjectByType<Source, Target>, Target>
  | ((source: Source, context?: MapperContext) => any)
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Schema<Source, Exclude<Target[TargetKey], Function | Primitive>>
  | SubSchema<Source, Target[TargetKey]>;

/**
 * @public
 */
type SubSchema<Source, Target> = {
  [Path in PropertyPath<Source>]: {
    $context?: MapperContext;
    $path: Path;
    $subschema: Schema<PropertyType<Source, Path>, Target> | '$self';
  };
}[PropertyPath<Source>];

type TreeShakeObjectByType<T, Type, ExcludeOptional = false> = {
  [P in keyof T as T[P] extends (
    ExcludeOptional extends true ? Type | object : Type | object | undefined
  )
    ? P
    : // eslint-disable-next-line @typescript-eslint/ban-types
      never]: T[P] extends object ? TreeShakeObjectByType<T[P], Type> : T[P];
};

type ExtractPathsOfType<Source, KeyType> = {
  [Path in PropertyPath<Source> as PropertyType<Source, Path> extends KeyType
    ? Path
    : never]: KeyType;
};
