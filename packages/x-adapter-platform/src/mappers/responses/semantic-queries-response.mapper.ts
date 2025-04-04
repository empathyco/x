import type { SemanticQueriesResponse } from '@empathyco/x-types';
import type { PlatformSemanticQueriesResponse } from '../../types/responses/semantic-queries-response.model';
 
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { semanticQueriesResponseSchema } from '../../schemas';

/**
 * Default implementation for the SemanticQueriesResponseMapper.
 *
 * @public
 */
export const semanticQueriesResponseMapper = schemaMapperFactory<
  PlatformSemanticQueriesResponse,
  SemanticQueriesResponse
>(semanticQueriesResponseSchema);
