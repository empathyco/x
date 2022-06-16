import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { SearchRequest } from '@empathyco/x-types';
import { searchRequestMutableSchema } from '../../schemas/requests/search-request.schema';
import { PlatformSearchRequest } from '../../types/requests/search-request.model';

export const searchRequestMapper = schemaMapperFactory<SearchRequest, PlatformSearchRequest>(
  searchRequestMutableSchema
);
