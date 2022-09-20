import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { IdentifierResultsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model';

export const identifierResultsRequestSchema = createMutableSchema<
  Schema<IdentifierResultsRequest, PlatformIdentifierResultsRequest>
>({
  query: 'query',
  origin: 'origin',
  start: 'start',
  rows: 'rows',
  extraParams: 'extraParams'
});
