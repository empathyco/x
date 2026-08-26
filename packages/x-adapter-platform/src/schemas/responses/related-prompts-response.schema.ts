import type { RelatedPromptsResponse } from '@empathyco/x-types'
import type { PlatformRelatedPromptsResponse } from '../../types/responses/related-prompts-response.model'
import { createContextualMapperFactory } from '@empathyco/x-adapter'
import { z } from 'zod'
import { relatedPromptSchema } from '../models/related-prompt.schema'

/**
 * Default implementation for the RelatedPromptsResponseSchema.
 *
 * @public
 */
export const relatedPromptsResponseSchema = createContextualMapperFactory<
  PlatformRelatedPromptsResponse,
  RelatedPromptsResponse
>(context =>
  z
    .object({
      data: z
        .object({
          relatedprompts: z.array(z.any()).optional(),
        })
        .passthrough()
        .optional(),
    })
    .passthrough()
    .transform(
      (source): RelatedPromptsResponse => ({
        relatedPrompts:
          source.data?.relatedprompts?.map(item => relatedPromptSchema(context).parse(item)) ?? [],
      }),
    ),
)
