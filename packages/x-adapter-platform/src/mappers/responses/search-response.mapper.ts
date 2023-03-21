import { schemaMapperFactory } from '@empathyco/x-adapter';
import { SearchResponse } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { searchResponseSchema } from '../../schemas/responses/search-response.schema';

/**
 * Default implementation for the SearchResponseMapper.
 *
 * @public
 */
export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  searchResponseSchema
);
