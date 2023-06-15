import { createMutableSchema } from '@empathyco/x-adapter';
import { Suggestion } from '@empathyco/x-types';
import { PlatformSuggestion } from '../../types/models/suggestion.model';

/**
 * Default implementation for the SuggestionSchema.
 *
 * @public
 */
export const suggestionSchema = createMutableSchema<PlatformSuggestion, Suggestion>({
  query: ({ title_raw, keywords }) => title_raw ?? keywords,
  key: ({ title_raw, keywords }) => title_raw ?? keywords,
  modelName: (_, $context) =>
    $context?.requestParameters?.query ? 'QuerySuggestion' : 'PopularSearch',
  facets: () => [],
  isCurated: () => false
});
