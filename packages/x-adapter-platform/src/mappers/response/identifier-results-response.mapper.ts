import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { IdentifierResultsResponse } from '@empathyco/x-types';
/* eslint-disable max-len */
import { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';
import { identifierResultsResponseMutableSchema } from '../../schemas/response/identifier-results-response.schema';
/* eslint-enable max-len */

export const identifierResultsResponseMapper = schemaMapperFactory<
  PlatformIdentifierResultsResponse,
  IdentifierResultsResponse
>(identifierResultsResponseMutableSchema);
