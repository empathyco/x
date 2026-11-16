import type { RelatedTagsRequest } from '@empathyco/x-types'
import type { PlatformRelatedTagsRequest } from '../../types/requests/related-tags-request.model'
import { createTransformSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the RelatedTagsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const relatedTagsRequestSchema = createTransformSchema<
  RelatedTagsRequest,
  PlatformRelatedTagsRequest
>({
  transform: (source): PlatformRelatedTagsRequest =>
    defined<PlatformRelatedTagsRequest>({
      query: source.query,
      extraParams: source.extraParams,
    }),
})
