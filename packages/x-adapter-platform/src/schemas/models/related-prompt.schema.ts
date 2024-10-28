import { createMutableSchema } from '@empathyco/x-adapter';
import { RelatedPrompt } from '@empathyco/x-types';
import { PlatformRelatedPrompt } from '../../types/models/related-prompt.model';

/**
 * Default implementation for the RelatedPromptSchema.
 */
export const relatedPromptSchema = createMutableSchema<PlatformRelatedPrompt, RelatedPrompt>({
  modelName: () => 'RelatedPrompt',
  nextQueries: 'nextQueries',
  suggestionText: 'suggestionText',
  type: 'type'
});
