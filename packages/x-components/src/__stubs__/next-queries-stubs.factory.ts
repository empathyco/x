import { NextQuery } from '@empathyco/x-types';

/**
 * Creates {@link @empathyco/x-types#NextQuery | next queries} stub.
 *
 * @param amount - Number of stubbed next queries to create.
 *
 * @returns Array of next queries stub.
 *
 * @internal
 */
export function getNextQueriesStub(amount = 3): NextQuery[] {
  return Array.from<number, NextQuery>({ length: amount }, (_, index) =>
    createNextQueryStub(`Next query ${index + 1}`)
  );
}

/**
 * Creates a next query stub with the provided options. If the name is the only property provided,
 * it will be used to generate the facets, query, totalResults, results and modelName.
 *
 * @param query - The query of the next query.
 * @param nextQuery - An optional object with fields to override the next query.
 *
 * @returns A next query.
 */
export function createNextQueryStub(query: string, nextQuery?: Partial<NextQuery>): NextQuery {
  return {
    facets: [],
    query,
    totalResults: 10,
    results: [],
    modelName: 'NextQuery',
    ...nextQuery
  };
}
