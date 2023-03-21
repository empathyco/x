import { schemaMapperFactory } from '@empathyco/x-adapter';
import { PopularSearchesResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { popularSearchesResponseSchema } from '../../schemas/responses/popular-searches-response.schema';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches-response.model';

/**
 * Default implementation for the PopularSearchesResponseMapper.
 *
 * @public
 */
export const popularSearchesResponseMapper = schemaMapperFactory<
  PlatformPopularSearchesResponse,
  PopularSearchesResponse
>(popularSearchesResponseSchema);
