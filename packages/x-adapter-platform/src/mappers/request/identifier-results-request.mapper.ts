import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { IdentifierResultsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsRequestMutableSchema } from '../../schemas/request/identifier-results-request.schema';
import {
  BasePlatformIdentifierResultsRequest,
  PlatformIdentifierResultsRequest
} from '../../types/requests/identifier-results-request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const identifierResultsRequestMapper = combineMappers<
  IdentifierResultsRequest,
  PlatformIdentifierResultsRequest
>(
  schemaMapperFactory<IdentifierResultsRequest, BasePlatformIdentifierResultsRequest>(
    identifierResultsRequestMutableSchema
  ),
  extraParamsRequestMapper
);
