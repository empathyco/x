import type { RelatedPromptsResponse } from '@empathyco/x-types'
import type { PlatformListResponseSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { relatedPromptSchema } from '../models/related-prompt.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RelatedPromptsResponseSchema.
 *
 * @public
 */
export const relatedPromptsResponseSchema = createTransformSchema<
  PlatformListResponseSource<'data', 'relatedprompts'>,
  RelatedPromptsResponse
>({
  transform: (source, context): RelatedPromptsResponse =>
    defined<RelatedPromptsResponse>({
      relatedPrompts: parseEach(relatedPromptSchema, source.data?.relatedprompts, context),
    }),
})
