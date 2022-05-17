import { MapFn, Mapper } from '../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export function pipeMappers<From, To, Context>(
  ...mappers: Mapper<From, To, Context>[]
): MapFn<From, To, Context> {
  if (mappers.length === 1) {
    return mappers[0].map.bind(mappers[0]);
  } else {
    return (from: From, initialTo: To, context: Context) =>
      mappers.reduce((to, mapper) => mapper.map(from, to, context), initialTo);
  }
}
