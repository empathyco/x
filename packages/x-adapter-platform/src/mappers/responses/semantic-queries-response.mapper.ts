import { schemaMapperFactory } from '@empathyco/x-adapter';
import { SemanticQueriesResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformSemanticQueriesResponse } from '../../types/responses/semantic-queries-response.model';
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
