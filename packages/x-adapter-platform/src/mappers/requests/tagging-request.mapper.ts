import type { Mapper } from '@empathyco/x-adapter'
import type { TaggingRequest } from '@empathyco/x-types'

/**
 * Default implementation for the TaggingRequestMapper.
 *
 * @param request - The tagging request.
 * @returns The tagging request params.
 *
 * @public
 */
export const taggingRequestMapper: Mapper<TaggingRequest, any> = (request: TaggingRequest) =>
  request.params
