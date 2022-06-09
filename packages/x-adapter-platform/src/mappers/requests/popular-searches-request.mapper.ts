import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { popularSearchesRequestMutableSchema } from '../../schemas/requests/popular-searches-request.schema';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model';

export const popularSearchesRequestMapper = schemaMapperFactory<
  PopularSearchesRequest,
  PlatformPopularSearchesRequest
>(popularSearchesRequestMutableSchema);
