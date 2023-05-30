import { createMutableSchema } from '@empathyco/x-adapter';
import { SemanticQuery } from '@empathyco/x-types';
import { PlatformSemanticQuery } from '../../types';

/**
 * Default implementation for the SemanticQuery schema.
 *
 * @public
 */
export const semanticQuerySchema = createMutableSchema<PlatformSemanticQuery, SemanticQuery>({
  query: 'query',
  modelName: () => 'SemanticQuery',
  distance: 'distance'
});
