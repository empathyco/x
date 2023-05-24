import { createMutableSchema } from '@empathyco/x-adapter';
import { SemanticQueriesRequest } from '@empathyco/x-types';
import { objectFilter } from '@empathyco/x-utils/src';
import { PlatformSemanticQueriesRequest } from '../../types';

export const semanticQueriesRequestSchema = createMutableSchema<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>({
  q: 'query',
  extraParams: ({ extraParams }) => {
    return objectFilter(extraParams, key => key !== 'instance');
  }
});
