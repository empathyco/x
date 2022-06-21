import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { QuerySuggestionsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model';
import { suggestionMutableSchema } from '../models/suggestion.schema';

export const querySuggestionsResponseMutableSchema = createMutableSchema<
  Schema<PlatformQuerySuggestionsResponse, QuerySuggestionsResponse>
>({
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionMutableSchema
  }
});
