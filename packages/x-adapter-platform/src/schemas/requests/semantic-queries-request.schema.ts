import { createMutableSchema } from '@empathyco/x-adapter';
import { SemanticQueriesRequest } from '@empathyco/x-types';
import { objectFilter } from '@empathyco/x-utils';
import { PlatformSemanticQueriesRequest } from '../../types';

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
  extraParams: ({ extraParams }) => {
    return objectFilter(extraParams, key => key !== 'instance');
  }
});
