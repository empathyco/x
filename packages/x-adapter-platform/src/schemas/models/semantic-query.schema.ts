import { createMutableSchema } from '@empathyco/x-adapter';
import { SemanticQuery } from '@empathyco/x-types';
import { PlatformSemanticQuery } from '../../types';

export const semanticQuerySchema = createMutableSchema<PlatformSemanticQuery, SemanticQuery>({
  query: 'query',
  modelName: () => 'SemanticQuery',
  distance: 'distance'
});
