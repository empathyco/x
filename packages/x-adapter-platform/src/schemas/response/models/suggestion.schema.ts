import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Suggestion } from '@empathyco/x-types';
import { PlatformSuggestion } from '../../../types/response/models/suggestion.model';

export const suggestionSchema: Schema<PlatformSuggestion, Suggestion> = {
  query: 'title_raw',
  key: 'title_raw',
  modelName: (_, $context) =>
    $context?.requestParameters?.query ? 'QuerySuggestion' : 'PopularSearch',
  facets: () => [],
  isCurated: () => false
};

export const suggestionMutableSchema = createMutableSchema(suggestionSchema);
