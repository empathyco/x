import { deepMerge } from '@empathyco/x-deep-merge';
import { SemanticQuery } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils/src/index';

export function createSemanticQuery(semanticQuery: DeepPartial<SemanticQuery>): SemanticQuery {
  const query = {
    modelName: 'SemanticQuery',
    distance: 1,
    query: 'test'
  };

  return deepMerge(query, semanticQuery);
}
