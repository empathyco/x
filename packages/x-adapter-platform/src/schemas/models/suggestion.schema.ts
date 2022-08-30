import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { Suggestion } from '@empathyco/x-types';
import { PlatformSuggestion } from '../../types/models/suggestion.model';

export const suggestionSchema = createMutableSchema<Schema<PlatformSuggestion, Suggestion>>({
  query: 'title_raw',
  key: 'title_raw',
  modelName: (_, $context) =>
    $context?.requestParameters?.query ? 'QuerySuggestion' : 'PopularSearch',
  facets: () => [],
  isCurated: () => false
});
