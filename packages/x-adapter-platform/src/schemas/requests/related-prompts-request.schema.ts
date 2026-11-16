import type { RelatedPromptsRequest } from '@empathyco/x-types'
import type { PlatformRelatedPromptsRequest } from '../../types/requests/related-prompts-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the RelatedPromptsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const relatedPromptsRequestSchema = createMutableZodSchema<
  RelatedPromptsRequest,
  PlatformRelatedPromptsRequest
>({
  transform: (source): PlatformRelatedPromptsRequest =>
    defined<PlatformRelatedPromptsRequest>({
      query: source.query,
      extraParams: source.extraParams,
    }),
})
