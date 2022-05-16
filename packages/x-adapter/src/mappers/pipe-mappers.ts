import { Mapper } from './mapper.types';

/**
 * Combines the given {@link Mapper | mappers} into a single {@link Mapper | mapper function}.
 *
 * @param mappers - The {@link Mapper | mapper functions} to combine.
 * @returns The combined {@link Mapper | mapper function}.
 *
 * @public
 */
export function pipeMappers<From, To>(...mappers: Mapper<any, any>[]): Mapper<From, To> {
  return mappers.length === 1
    ? mappers[0]
    : (from, context) => mappers.reduce((result, mapper) => mapper(result, context), from as any);
}
