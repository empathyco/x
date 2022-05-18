import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { QuerySuggestionsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsRequestMutableSchema } from '../../schemas/request/query-suggestions.schema';
import {
  BaseQuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
} from '../../types/requests/query-suggestions-request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const querySuggestionsRequestMapper = combineMappers<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>(
  schemaMapperFactory<QuerySuggestionsRequest, BaseQuerySuggestionsRequest>(
    querySuggestionsRequestMutableSchema
  ),
  extraParamsRequestMapper
);
