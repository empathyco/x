import type { SemanticQueriesResponse, SemanticQuery } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import { deepMerge } from '@empathyco/x-deep-merge'

/**
 * Creates a {@link SemanticQuery} stub with the provided options.
 *
 * @param semanticQuery - The data to create the stub.
 *
 * @returns A semantic query.
 */
export function createSemanticQuery(semanticQuery: DeepPartial<SemanticQuery>) {
  const query = {
    modelName: 'SemanticQuery',
    distance: 1,
    query: 'test',
  }

  return deepMerge(query, semanticQuery) as SemanticQuery
}

/**
 * Creates a stub containing a list of {@link SemanticQuery}s.
 *
 * @returns A list of semantic queries stubs.
 */
export function getSemanticQueriesStub(): SemanticQueriesResponse {
  return {
    semanticQueries: [
      {
        query: 'test 1',
        modelName: 'SemanticQuery',
        distance: 1,
      },
      {
        query: 'test 2',
        modelName: 'SemanticQuery',
        distance: 2,
      },
      {
        query: 'test 3',
        modelName: 'SemanticQuery',
        distance: 3,
      },
    ],
  }
}
