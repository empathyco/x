import { schemaMapperFactory } from '@empathyco/x-adapter';
import { SemanticQueriesRequest } from '@empathyco/x-types';
import { PlatformSemanticQueriesRequest } from '../../types';
// eslint-disable-next-line max-len
import { semanticQueriesRequestSchema } from '../../schemas/requests/semantic-queries-request.schema';

/**.
 * Default implementation for the SemanticQueriesRequestMapper
 *
 * @public
 */
export const semanticQueriesRequestMapper = schemaMapperFactory<
  SemanticQueriesRequest,
  PlatformSemanticQueriesRequest
>(semanticQueriesRequestSchema);
