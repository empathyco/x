import type { IdentifierResultsRequest } from '@empathyco/x-types';
import type { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the IdentifierResultsRequestSchema.
 *
 * @public
 */
export const identifierResultsRequestSchema = createMutableSchema<
  IdentifierResultsRequest,
  PlatformIdentifierResultsRequest
>({
  query: 'query',
  origin: 'origin',
  start: 'start',
  rows: 'rows',
  extraParams: 'extraParams'
});
