import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { SearchRequest } from '@empathyco/x-types';
import { searchRequestMutableSchema } from '../../schemas/request/search-request.schema';
import {
  BasePlatformSearchRequest,
  PlatformSearchRequest
} from '../../types/requests/search-request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const searchRequestMapper = combineMappers<SearchRequest, PlatformSearchRequest>(
  schemaMapperFactory<SearchRequest, BasePlatformSearchRequest>(searchRequestMutableSchema),
  extraParamsRequestMapper
);
