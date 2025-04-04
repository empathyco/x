import type { QuerySuggestionsResponse } from '@empathyco/x-types';
import type { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model';
 
import { schemaMapperFactory } from '@empathyco/x-adapter';
 
import { querySuggestionsResponseSchema } from '../../schemas/responses/query-suggestions-response.schema';

/**
 * Default implementation for the QuerySuggestionsResponseMapper.
 *
 * @public
 */
export const querySuggestionsResponseMapper = schemaMapperFactory<
  PlatformQuerySuggestionsResponse,
  QuerySuggestionsResponse
>(querySuggestionsResponseSchema);
