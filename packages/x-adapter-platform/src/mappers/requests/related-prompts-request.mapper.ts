import type { RelatedPromptsRequest } from '@empathyco/x-types'
import type { PlatformRelatedPromptsRequest } from '../../types/requests/related-prompts-request.model'
import { transformSchemaMapperFactory } from '@empathyco/x-adapter'
import { relatedPromptsRequestSchema } from '../../schemas/requests/related-prompts-request.schema'

/**
 * Default implementation for the RelatedPromptsRequestMapper.
 *
 * @public
 */
export const relatedPromptsRequestMapper = transformSchemaMapperFactory<
  RelatedPromptsRequest,
  PlatformRelatedPromptsRequest
>(relatedPromptsRequestSchema)
