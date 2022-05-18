import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { IdentifierResultsRequest } from '@empathyco/x-types';
/* eslint-disable max-len */
import { identifierResultsRequestMutableSchema } from '../../schemas/request/identifier-results-request.schema';
import {
  BasePlatformIdentifierResultsRequest,
  PlatformIdentifierResultsRequest
} from '../../types/requests/identifier-results-request.model';
/* eslint-enable max-len */
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
