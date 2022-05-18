import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';
// eslint-disable-next-line max-len
import { identifierResultsResponseMutableSchema } from '../../schemas/response/identifier-results-response.schema';

export const identifierResultsResponseMapper = schemaMapperFactory<
  PlatformIdentifierResultsResponse,
  IdentifierResultsResponse
>(identifierResultsResponseMutableSchema);
