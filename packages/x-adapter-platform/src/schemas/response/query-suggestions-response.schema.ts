import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { QuerySuggestionsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsResponse } from '../../types/response/query-suggestions-response.model';
import { suggestionMutableSchema } from './models/suggestion.schema';

export const querySuggestionsResponseSchema: Schema<
  PlatformQuerySuggestionsResponse,
  QuerySuggestionsResponse
> = {
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionMutableSchema
  }
};

export const querySuggestionsResponseMutableSchema = createMutableSchema(
  querySuggestionsResponseSchema
);
