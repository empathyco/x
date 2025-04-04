import type { RelatedPromptsResponse } from '@empathyco/x-types'
import type { PlatformRelatedPromptsResponse } from '../../types/responses/related-prompts-response.model'

import { createMutableSchema } from '@empathyco/x-adapter'
import { relatedPromptSchema } from '../models/related-prompt.schema'

/**
 * Default implementation for the RelatedPromptsResponseSchema.
 *
 * @public
 */
export const relatedPromptsResponseSchema = createMutableSchema<
  PlatformRelatedPromptsResponse,
  RelatedPromptsResponse
>({
  relatedPrompts: {
    $path: 'data.relatedprompts',
    $subSchema: relatedPromptSchema,
  },
})
