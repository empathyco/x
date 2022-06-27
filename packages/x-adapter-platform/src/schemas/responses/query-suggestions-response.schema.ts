import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { QuerySuggestionsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model';
import { suggestionSchema } from '../models/suggestion.schema';

export const querySuggestionsResponseSchema = createMutableSchema<
  Schema<PlatformQuerySuggestionsResponse, QuerySuggestionsResponse>
>({
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionSchema
  }
});
