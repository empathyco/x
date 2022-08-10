import { schemaMapperFactory } from '@empathyco/x-adapter';
import { IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { identifierResultsResponseSchema } from '../../schemas/responses/identifier-results-response.schema';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';

export const identifierResultsResponseMapper = schemaMapperFactory<
  PlatformIdentifierResultsResponse,
  IdentifierResultsResponse
>(identifierResultsResponseSchema);
