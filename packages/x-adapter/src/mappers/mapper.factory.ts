import { PropertyPath, PropertyType } from '@empathyco/x-utils';
import { Mapper, MapperContext } from '../types';
import { Schema, SchemaTransformer } from '../schemas/schemas.types';

const isObject = (obj: any): obj is Record<string, unknown> => {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
};

const isArray = (arr: any): arr is any[] => {
  return arr && Array.isArray(arr);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (func: any): func is Function => {
  return typeof func === 'function';
};

/**
 * I.
 *
 * @param source - I.
 * @param path - I.
 * @param extraPath - I.
 *
 * @returns Yes.
 */
function getValueFromPath<Source>(
  source: Source,
  path: PropertyPath<Source>,
  extraPath?: PropertyPath<Source>
): PropertyType<Source, PropertyPath<Source>> {
  const [first, ...keys] = path.replace(`${extraPath ? `${extraPath}.` : ''}`, '').split('.') as [
    keyof Source,
    ...string[]
  ];

  if (!source[first]) {
    throw new Error('De locos');
  }
  return getPathValue(source[first], keys) as PropertyType<Source, PropertyPath<Source>>;
}

/**
 * I.
 *
 * @param source - I.
 * @param keys - I.
 *
 * @returns I.
 */
function getPathValue<Source>(
  source: Source,
  keys: string[]
): PropertyType<Source, PropertyPath<Source>> {
  const [first, ...innerKeys] = keys as [keyof Source, ...string[]];
  if (!first) {
    return source as PropertyType<Source, PropertyPath<Source>>;
  }
  const value = source[first] as PropertyType<Source, PropertyPath<Source>>;
  if (isObject(value) || isArray(value)) {
    getPathValue(value, innerKeys);
  }

  return value;
}

/**
 * I.
 *
 * @param schema - I.
 *
 * @returns I.
 */
export function mapperFactory<Source, Target>(
  schema: Schema<Source, Target>
): Mapper<Source, Target> {
  // const selfSubSchemasApplied: Record<string, boolean> = {};

  /**
   *
   * I.
   *
   * @param source - I.
   * @param schema - I.
   * @param context - I.
   * @param extraPath - I.
   *
   *@returns Yes.
   */
  function mapSchema<Source, Target>(
    source: Source,
    schema: Schema<Source, Target>,
    context: MapperContext,
    extraPath?: PropertyPath<Source>
  ): Target {
    return reduce<Schema<Source, Target>, Target>(
      schema,
      (target, key, transformer: SchemaTransformer<Source, Target, keyof Target>) => {
        if (typeof transformer === 'string') {
          target[key] = getValueFromPath(
            source,
            transformer as unknown as PropertyPath<Source>,
            extraPath
          ) as Target[keyof Target];
        } else if (isFunction(transformer)) {
          target[key] = transformer(source, context);
        } else if (isObject(transformer)) {
          if ('$path' in transformer) {
            if (transformer.$subschema === '$self') {
              // const subSchemaHash = `${transformer.$path}:${JSON.stringify(transformer)}`;
              // if (selfSubSchemasApplied[subSchemaHash]) {
              //   return target;
              // }
              //
              // selfSubSchemasApplied[subSchemaHash] = true;

              // const subSchema = { ...schema, [key]: undefined };
              delete transformer.$subschema;
              target[key] = mapSchema<Source, Target[keyof Target]>(
                source,
                schema as unknown as Schema<Source, Target[keyof Target]>,
                context
              );
            } else {
              if (!transformer.$subschema) {
                return target;
              }
              const subSource = getValueFromPath(source, transformer['$path']);
              target[key] = mapSchema<typeof subSource, Target[keyof Target]>(
                subSource,
                transformer.$subschema,
                context,
                transformer.$path as PropertyPath<typeof subSource>
              );
            }
          } else {
            target[key] = mapSchema<Source, Target[keyof Target]>(
              source,
              transformer as unknown as Schema<Source, Target[keyof Target]>,
              context
            );
          }
        }
        return target;
      },
      {} as Target
    );
  }

  /**
   * I.
   *
   * @param source - I.
   * @param context - I.
   *
   * @returns I.
   */
  function mapper(source: Source, context: MapperContext = {}): Target {
    return mapSchema<Source, Target>(source, schema, context);
  }

  return mapper;
}

// function createMapperFromSchema<Source, Target>(
//   schema: Schema<Source, Target>
// ): Mapper<Source, Target> {
//   const mapper = (source: Source, context: MapperContext = {}): Target => {
//     if (Array.isArray(source)) {
//       return source.map(reducer) as unknown as Target;
//     } else {
//       return reducer(source);
//     }
//
//     function reducer(source: any): any {
//       if (source === undefined || source === null) {
//         return source;
//       }
//       return reduce(
//         schema,
//         (target, targetKey, transformer: SchemaTransformer<Source, Target, keyof Target>) => {
//           const value = createMapperFromSchemaTransformer<Source, Target, keyof Target>(
//             transformer,
//             mapper
//           )(source, context);
//           if (value !== undefined) {
//             target[targetKey] = value;
//           }
//           return target;
//         },
//         {} as Target
//       );
//     }
//   };
//   return mapper;
// }
//
// function createMapperFromSchemaTransformer<Source, Target, TargetKey extends keyof Target>(
//   schemaTransformer: SchemaTransformer<Source, Target, keyof Target>,
//   parentMapper: Mapper<Source, Target>
// ): Mapper<Source, Target[TargetKey]> {
//   return typeof schemaTransformer === 'function'
//     ? (source, context) => schemaTransformer(source, context)
//     : a => a;
// }

/**
 * I.
 *
 * @param obj - I.
 * @param reducer - I.
 * @param initialValue - I.
 *
 * @returns I.
 */
export function reduce<T extends Record<string, any>, V>(
  obj: T | undefined | null,
  reducer: (
    accumulator: V,
    key: keyof T,
    value: Exclude<T[keyof T], undefined>,
    index: number
  ) => V,
  initialValue: V
): V {
  let accumulator = initialValue;
  forEach(obj, (key, value, index) => {
    accumulator = reducer(accumulator, key, value, index);
  });
  return accumulator;
}

/**
 * I.
 *
 * @param obj - I.
 * @param callbackFn - I.
 */
export function forEach<T extends Record<string, any>>(
  obj: T | undefined | null,
  callbackFn: (key: keyof T, value: Exclude<T[keyof T], undefined>, index: number) => void
): void {
  if (obj == null) {
    return;
  }

  let index = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      callbackFn(key, obj[key], index++);
    }
  }
}
