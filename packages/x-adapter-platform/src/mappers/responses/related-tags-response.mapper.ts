import type { RelatedTagsResponse } from '@empathyco/x-types'
import type { PlatformRelatedTagsResponse } from '../../types/responses/related-tags-response.model'
import { zSchemaMapperFactory } from '@empathyco/x-adapter'
import { relatedTagsResponseSchema } from '../../schemas/responses/related-tags-response.schema'

/**
 * Default implementation for the RelatedTagsResponseMapper.
 *
 * @public
 */
export const relatedTagsResponseMapper = zSchemaMapperFactory<
  PlatformRelatedTagsResponse,
  RelatedTagsResponse
>(relatedTagsResponseSchema)
