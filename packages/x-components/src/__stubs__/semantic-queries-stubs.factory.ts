import { deepMerge } from '@empathyco/x-deep-merge';
import { SemanticQueriesResponse, SemanticQuery } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils/src/types/utils.types';

export function createSemanticQuery(semanticQuery: DeepPartial<SemanticQuery>): SemanticQuery {
  const query = {
    modelName: 'SemanticQuery',
    distance: 1,
    query: 'test'
  };

  return deepMerge(query, semanticQuery);
}

export function getSemanticQueriesStub(): SemanticQueriesResponse {
  return {
    semanticQueries: [
      {
        query: 'test 1',
        modelName: 'SemanticQuery',
        distance: 1
      },
      {
        query: 'test 2',
        modelName: 'SemanticQuery',
        distance: 2
      },
      {
        query: 'test 3',
        modelName: 'SemanticQuery',
        distance: 3
      }
    ]
  };
}
