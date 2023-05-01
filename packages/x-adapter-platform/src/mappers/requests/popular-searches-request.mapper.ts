import { schemaMapperFactory } from '@empathyco/x-adapter';
import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { popularSearchesRequestSchema } from '../../schemas/requests/popular-searches-request.schema';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model';

/**
 * Default implementation for the PopularSearchesRequestMapper.
 *
 * @public
 */
export const popularSearchesRequestMapper = schemaMapperFactory<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>(popularSearchesRequestSchema);
