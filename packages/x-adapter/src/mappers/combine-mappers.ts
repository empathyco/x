import { deepMerge } from '@empathyco/x-deep-merge';
import { DeepPartial } from '@empathyco/x-utils';
import { Mapper } from './mapper.types';

/**
 * Combines the given {@link Mapper | mappers} into a single {@link Mapper | mapper function}.
 *
 * @param mappers - The {@link Mapper | mapper functions} to combine.
 * @returns The combined {@link Mapper | mapper function}.
 *
 * @public
 */
export function combineMappers<From, To>(
  ...mappers: Mapper<From, DeepPartial<To>>[]
): Mapper<From, To> {
  return mappers.length === 1
    ? (mappers[0] as Mapper<From, To>)
    : (from, context) => {
        if (!context.to) {
          context.to = {};
        }

        return mappers.reduce<DeepPartial<To>>((result, mapper) => {
          const mappedResult = mapper(from, context);
          deepMerge(context.to, mappedResult);
          return deepMerge(result, mappedResult);
        }, {}) as To;
      };
}
