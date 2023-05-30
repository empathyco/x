import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { SemanticQueriesResponse } from '@empathyco/x-types';
import { semanticQuerySchema } from '../models/semantic-query.schema';
// eslint-disable-next-line max-len
import { PlatformSemanticQueriesResponse } from '../../types/responses/semantic-queries-response.model';

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
