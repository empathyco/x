import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { SearchResponse } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { searchResponseMutableSchema } from '../../schemas/response/search-response.schema';

export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  searchResponseMutableSchema
);
