import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { BasePlatformPopularSearchesRequest } from '../../types/requests/popular-searches.request.model';

export const popularSearchesRequestSchema: Schema<
  PopularSearchesRequest,
  BasePlatformPopularSearchesRequest
> = {
  start: 'start',
  rows: 'rows'
};

export const popularSearchesRequestMutableSchema = createMutableSchema(
  popularSearchesRequestSchema
);
