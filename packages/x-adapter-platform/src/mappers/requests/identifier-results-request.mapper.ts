import { schemaMapperFactory } from '@empathyco/x-adapter';
import { IdentifierResultsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsRequestSchema } from '../../schemas/requests/identifier-results-request.schema';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model';

export const identifierResultsRequestMapper = schemaMapperFactory<
  IdentifierResultsRequest,
  PlatformIdentifierResultsRequest
>(identifierResultsRequestSchema);
