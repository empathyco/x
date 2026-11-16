import type { RelatedPromptsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { relatedPromptSchema } from '../models/related-prompt.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the RelatedPromptsResponseSchema.
 *
 * @public
 */
export const relatedPromptsResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    data: z.optional(z.looseObject({ relatedprompts: z.optional(z.array(z.unknown())) })),
  }),
  transform: (source, context): RelatedPromptsResponse =>
    defined<RelatedPromptsResponse>({
      relatedPrompts: parseEach(relatedPromptSchema, source.data?.relatedprompts, context),
    }),
})
