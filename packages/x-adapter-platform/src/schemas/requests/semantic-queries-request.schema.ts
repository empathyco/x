import type { SemanticQueriesRequest } from '@empathyco/x-types';
import type { PlatformSemanticQueriesRequest } from '../../types';
import { createMutableSchema } from '@empathyco/x-adapter';

/**
 * Default implementation for the SemanticQueriesRequestSchema.
 *
 * @public
 */
export const semanticQueriesRequestSchema = createMutableSchema<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>({
  q: 'query',
  extraParams: 'extraParams'
});
