import type { RelatedPromptsResponse } from '@empathyco/x-types'
import type { PlatformRelatedPromptsResponse } from '../../types/responses/related-prompts-response.model'
import { relatedPromptsResponseSchema } from '../../schemas/responses/related-prompts-response.schema'

/**
 * Default implementation for the RelatedPromptsResponseMapper.
 *
 * @public
 */
export const relatedPromptsResponseMapper = relatedPromptsResponseSchema as (
  source: PlatformRelatedPromptsResponse,
  context: Record<string, unknown>,
) => RelatedPromptsResponse
