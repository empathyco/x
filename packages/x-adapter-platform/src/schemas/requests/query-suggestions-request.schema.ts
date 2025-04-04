import type { QuerySuggestionsRequest } from '@empathyco/x-types';
import type { PlatformQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the QuerySuggestionsRequestSchema.
 *
 * @public
 */
export const querySuggestionsRequestSchema = createMutableSchema<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>({
  query: 'query',
  start: 'start',
  rows: 'rows',
  extraParams: 'extraParams'
});
