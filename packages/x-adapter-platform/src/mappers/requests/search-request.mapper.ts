import { schemaMapperFactory } from '@empathyco/x-adapter';
import { SearchRequest } from '@empathyco/x-types';
import { searchRequestSchema } from '../../schemas/requests/search-request.schema';
import { PlatformSearchRequest } from '../../types/requests/search-request.model';

/**
 * Default implementation for the SearchRequestMapper.
 *
 * @public
 */
export const searchRequestMapper = schemaMapperFactory<SearchRequest, PlatformSearchRequest>(
  searchRequestSchema
);
