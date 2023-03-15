import { schemaMapperFactory } from '@empathyco/x-adapter';
import { NextQueriesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { nextQueriesRequestSchema } from '../../schemas/requests/next-queries-request.schema';
import { PlatformNextQueriesRequest } from '../../types/requests/next-queries-request.model';

/**
 * Default implementation for the NextQueriesRequestMapper.
 *
 * @public
 */
export const nextQueriesRequestMapper = schemaMapperFactory<
  NextQueriesRequest,
  PlatformNextQueriesRequest
>(nextQueriesRequestSchema);
