import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PopularSearchesResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { popularSearchesResponseMutableSchema } from '../../schemas/response/popular-searches-response.schema';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesResponse } from '../../types/responses/popular-searches.response.model';

export const popularSearchesResponseMapper = schemaMapperFactory<
  PlatformPopularSearchesResponse,
  PopularSearchesResponse
>(popularSearchesResponseMutableSchema);
