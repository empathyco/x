import { schemaMapperFactory } from '@empathyco/x-adapter';
import { SearchResponse } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { searchResponseSchema } from '../../schemas/responses/search-response.schema';

export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  searchResponseSchema
);
