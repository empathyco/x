import type { Schema } from '@empathyco/x-adapter';
import type { SemanticQueriesResponse } from '@empathyco/x-types';
import type { PlatformSemanticQueriesResponse } from '../../types/responses/semantic-queries-response.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';
import { semanticQuerySchema } from '../models/semantic-query.schema';

/**
 * Default implementation for the SemanticQueriesResponseSchema.
 *
 * @public
 */
export const semanticQueriesResponseSchema = createMutableSchema(<
  Schema<PlatformSemanticQueriesResponse, SemanticQueriesResponse>
>{
  semanticQueries: {
    $path: 'data.candidates',
    $subSchema: semanticQuerySchema
  }
});
