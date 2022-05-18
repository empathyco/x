import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { QuerySuggestionsRequest } from '@empathyco/x-types';
import { BaseQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model';

export const querySuggestionsRequestSchema: Schema<
  QuerySuggestionsRequest,
  BaseQuerySuggestionsRequest
> = {
  query: 'query',
  start: 'start',
  rows: 'rows'
};

export const querySuggestionsRequestMutableSchema = createMutableSchema(
  querySuggestionsRequestSchema
);
