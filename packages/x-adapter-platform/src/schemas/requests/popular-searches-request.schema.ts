import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { PopularSearchesRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformPopularSearchesRequest } from '../../types/requests/popular-searches-request.model';

export const popularSearchesRequestSchema = createMutableSchema<
  Schema<PopularSearchesRequest, PlatformPopularSearchesRequest>
>({
  start: 'start',
  rows: 'rows',
  extraParams: 'extraParams'
});
