import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { QuerySuggestionsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsRequest } from '../../types/request/query-suggestions-request.model';

export const querySuggestionsRequestSchema: Schema<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
> = {
  query: 'query',
  start: 'start',
  rows: 'rows',
  extraParams: 'extraParams'
};

export const querySuggestionsRequestMutableSchema = createMutableSchema(
  querySuggestionsRequestSchema
);
