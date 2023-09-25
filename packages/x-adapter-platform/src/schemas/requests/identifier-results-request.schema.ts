import { createMutableSchema } from '@empathyco/x-adapter';
import { IdentifierResultsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model';

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
